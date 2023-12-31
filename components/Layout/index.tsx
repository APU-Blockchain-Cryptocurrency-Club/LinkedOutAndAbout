import Head from "next/head";
import Image from "next/image";
import { ReactNode } from "react";
import { Button, MenuDropdown } from "..";
import { useAccount, useEnsName, useDisconnect, useEnsAvatar } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface Props {
  children: ReactNode;
  showWalletOptions: boolean;
  setShowWalletOptions: (showWalletOptions: boolean) => void;
}

export default function Layout(props: Props) {
  const { children } = props;
  const { disconnect } = useDisconnect();

  const { address, isConnected, isDisconnected } = useAccount();
  const {
    data: ensNameData,
    isError,
    isLoading,
  } = useEnsName({
    address: address,
  });

  const {
    data: ensAvatarData,
    isError: ensAvatarIsError,
    isLoading: ensAvatarIsLoading,
  } = useEnsAvatar({
    name: ensNameData,
  });

  const renderLabel = () => {
    if (address && ensNameData) {
      return (
        <>
          <div className="relative w-8 h-8 mr-2">
            {ensNameData ? (
              <Image
                src={ensAvatarData}
                alt="ENS Avatar"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            ) : (
              <Image
                src="/images/black-gradient.png"
                alt="ENS Avatar"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            )}
          </div>
          <span className="truncate max-w-[100px]">{ensNameData}</span>
        </>
      );
    } else {
      return (
        <>
          <div className="relative w-8 h-8 mr-2">
            <Image
              src="/images/black-gradient.png"
              alt="ENS Avatar"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          <span className="truncate max-w-[100px]">{address}</span>
        </>
      );
    }
  };

  const renderButton = () => {
    if (isConnected) {
      return (
        <MenuDropdown
          label={renderLabel()}
          options={[{ label: "Disconnect", onClick: disconnect }]}
        />
      );
    }

    return <ConnectButton />;
  };

  return (
    <div>
      <Head>
        <title>LinkedOut</title>
        <meta name="description" content="NextJS and wagmi template" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="absolute w-screen">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <h4 className="text-2xl font-bold text-black cursor-default">
              LinkedOut
            </h4>
          </div>
          {renderButton()}
        </div>
      </div>
      {children}
    </div>
  );
}
