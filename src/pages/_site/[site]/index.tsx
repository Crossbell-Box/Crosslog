import { GetServerSideProps } from "next"
import { SiteHome } from "~/components/site/SiteHome"
import { SiteLayout } from "~/components/site/SiteLayout"
import { createSSGHelpers } from "@trpc/react/ssg"
import { getTRPCContext } from "~/lib/trpc.server"
import { Viewer, Profile, Notes } from "~/lib/types"
import { getViewer } from "~/lib/viewer"
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { queryClientServer } from "~/lib/query-client.server"
import { prefetchGetSite } from "~/queries/site.server"
import { useGetSite } from "~/queries/site"
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { useGetPagesBySite } from "~/queries/page"
import { prefetchGetPagesBySite } from "~/queries/page.server"
import { PageVisibilityEnum } from "~/lib/types"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const domainOrSubdomain = ctx.params!.site as string

  await prefetchGetSite(domainOrSubdomain)
  await prefetchGetPagesBySite({
    site: domainOrSubdomain,
    take: 1000,
    type: "post",
    visibility: PageVisibilityEnum.Published,
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClientServer),
      domainOrSubdomain,
    },
  }
}

function SiteIndexPage({
  domainOrSubdomain,
}: {
  domainOrSubdomain: string
}) {
  const site = useGetSite(domainOrSubdomain)
  const posts = useGetPagesBySite({
    site: domainOrSubdomain,
    take: 1000,
    type: "post",
    visibility: PageVisibilityEnum.Published,
  })

  return (
    <SiteLayout site={site.data}>
      <SiteHome posts={posts.data} />
    </SiteLayout>
  )
}

export default SiteIndexPage
