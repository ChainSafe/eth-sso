export function windowOpen(
  url: string,
  width = 600,
  height = 600,
): WindowProxy | null {
  const left = window.innerWidth / 2 - width / 2;
  const top = window.innerHeight / 2 - height / 2;

  return window.open(
    url,
    "",
    `toolbar=no, location=no, directories=no, status=no, menubar=no, 
          scrollbars=no, resizable=yes, copyhistory=no, width=${width}, 
          height=${height}, top=${top}, left=${left}`,
  );
}

const FIVE_MIN = 5 * 60 * 1000;
export async function handleRedirect(
  popup: WindowProxy,
  callback: (event: MessageEvent) => Promise<boolean>,
  onClosed: () => void,
): Promise<void> {
  const redirected = new Promise<void>((resolve) => {
    window.addEventListener("message", (message) => {
      void callback(message).then((ok) => {
        if (ok) resolve();
      });
    });
  });

  const closed = new Promise<void>((resolve) =>
    setInterval(() => {
      if (popup.closed) {
        onClosed();
        resolve();
      }
    }, 250),
  );

  const timeout = new Promise((resolve) => setTimeout(resolve, FIVE_MIN));

  await Promise.race([redirected, closed, timeout]);
  popup.close();
}
