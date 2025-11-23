import { ConnectButton } from '@rainbow-me/rainbowkit';

function WalletBar() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        if (!connected) {
          return (
            <button className="walletBar walletBarDisconnected" onClick={openConnectModal}>
              <span className="walletBarLabel">Connect wallet</span>
            </button>
          );
        }

        return (
          <div className="walletBar" onClick={openAccountModal}>
            <div className="walletBarLeft">
              {/* Avatar (ENS avatar or fallback circle) */}
              <div className="walletAvatar">
                {account.ensAvatar ? (
                  <img src={account.ensAvatar} alt="Wallet avatar" />
                ) : (
                  <span className="walletAvatarFallback">
                    {account.displayName?.[0] ?? '🧬'}
                  </span>
                )}
              </div>

              <div className="walletText">
                <div className="walletAddress">{account.displayName}</div>
                <button
                  type="button"
                  className="walletChain"
                  onClick={(e) => {
                    e.stopPropagation();
                    openChainModal();
                  }}
                >
                  <span className="walletChainDot" />
                  <span className="walletChainName">
                    {chain?.name ?? 'Sei Testnet'}
                  </span>
                </button>
              </div>
            </div>

            <div className="walletBarRight">
              {account.displayBalance && (
                <span className="walletBalance">{account.displayBalance}</span>
              )}
            </div>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

export default WalletBar;
