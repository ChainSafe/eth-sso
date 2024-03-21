
export class ProviderSelectedEvent extends CustomEvent<{url: string}> {
  constructor(providerUrl: string) {
    super('providerSelected', {
      detail: {url: providerUrl},
    });
  }
}
