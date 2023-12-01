const getPasskeyCredential = async (challenge: string): Promise<Credential> => {
  const challengeBuffer = Uint8Array.from(challenge, (c) => c.charCodeAt(0));
  const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
    challenge: challengeBuffer,
    rpId: process.env.NEXT_PUBLIC_DOMAIN ?? window.location.hostname,
    userVerification: "preferred",
    timeout: 60000,
  };

  return await navigator.credentials.get({
    publicKey: publicKeyCredentialRequestOptions,
  });
};

export default getPasskeyCredential;
