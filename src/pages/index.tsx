import { GetServerSideProps } from "next"
import { useEffect, useState } from "react"
import { DashboardIcon } from "~/components/icons/DashboardIcon"
import { MainLayout } from "~/components/main/MainLayout"
import { UniLink } from "~/components/ui/UniLink"
import { getAuthUser } from "~/lib/auth.server"
import { FLY_REGION } from "~/lib/env.server"
import { useStore } from "~/lib/store"
import { useAccount } from 'wagmi'
import { ConnectButton } from "~/components/common/ConnectButton"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      region: FLY_REGION,
    },
  }
}

export default function Home({
  region,
}: {
  region: string | null
}) {
  const setLoginModalOpened = useStore((store) => store.setLoginModalOpened)
  const [address, setAddress] = useState<string>('')
  const { data: wagmiData } = useAccount()

  useEffect(() => {
    console.log("-> region", region)

    setAddress(wagmiData?.address || '')
  }, [region, wagmiData])

  return (
    <MainLayout>
      <section>
        <div className="max-w-screen-md px-5 mx-auto">
          <div className="bg-zinc-50 rounded-xl p-10">
            <h2 className="text-5xl font-extrabold">
              On-Chain Content Creating
              <br />
              for Absolutely Everyone
            </h2>
            <h3 className="mt-5 text-zinc-500">
              Meet Crosslog, the on-chain and open-source blogging platform for everyone.
              <br />
              Permanently stored on-chain and signed by you.
            </h3>
            <div className="mt-10">
              {address ? (
                <UniLink
                  href="/dashboard"
                  className="text-indigo-500 inline-flex items-center space-x-2 hover:text-indigo-600"
                >
                  <span className="i-bi-grid text-lg"></span>
                  <span>Dashboard</span>
                </UniLink>
              ) : (
                <ConnectButton />
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
