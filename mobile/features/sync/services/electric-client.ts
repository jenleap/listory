const ELECTRIC_URL = process.env.EXPO_PUBLIC_ELECTRIC_URL ?? 'http://localhost:5133';

export type ShapeRow = Record<string, unknown>;

export interface ShapeMessage {
  key: string;
  value: ShapeRow;
  action: 'insert' | 'update' | 'delete';
}

export let electricClient: ElectricClient | null = null;

export class ElectricClient {
  private readonly baseUrl: string;
  private readonly abortControllers: Map<string, AbortController> = new Map();

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async subscribeToShape(
    table: string,
    onMessage: (msg: ShapeMessage) => void
  ): Promise<() => void> {
    const existing = this.abortControllers.get(table);
    if (existing) {
      existing.abort();
    }

    const controller = new AbortController();
    this.abortControllers.set(table, controller);

    let offset = '-1';

    const poll = async () => {
      while (!controller.signal.aborted) {
        try {
          const url = `${this.baseUrl}/v1/shape/${table}?offset=${offset}`;
          const response = await fetch(url, { signal: controller.signal });

          if (!response.ok) {
            await delay(5000);
            continue;
          }

          const messages = await response.json() as Array<{
            key: string;
            value: ShapeRow;
            action: string;
            offset: string;
          }>;

          for (const msg of messages) {
            if (msg.offset) {
              offset = msg.offset;
            }
            if (msg.action === 'insert' || msg.action === 'update' || msg.action === 'delete') {
              onMessage({
                key: msg.key,
                value: msg.value,
                action: msg.action as ShapeMessage['action'],
              });
            }
          }
        } catch (err) {
          if (controller.signal.aborted) break;
          await delay(5000);
        }
      }
    };

    poll();

    return () => controller.abort();
  }

  disconnect(): void {
    for (const controller of this.abortControllers.values()) {
      controller.abort();
    }
    this.abortControllers.clear();
  }
}

export async function initElectric(): Promise<ElectricClient> {
  try {
    const response = await fetch(`${ELECTRIC_URL}/v1/health`);
    if (!response.ok) {
      throw new Error(`Electric health check failed: ${response.status}`);
    }
  } catch (err) {
    console.warn('ElectricSQL service unreachable, operating offline:', err);
  }

  const client = new ElectricClient(ELECTRIC_URL);
  electricClient = client;
  return client;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
