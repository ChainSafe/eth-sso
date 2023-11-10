const getPasskeyCredential = async (challenge: string) => {
    const challengeBuffer = Uint8Array.from(challenge, (c) => c.charCodeAt(0));
    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge: challengeBuffer,
      rpId: process.env.NEXT_PUBLIC_DOMAIN ?? "localhost:3000",
      userVerification: "preferred",
      timeout: 60000,
    };
  
    return await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });
  };
  
  export default getPasskeyCredential;