import { FormPopover } from "@/components/form/form-popover"
import { Hint } from "@/components/hint"
import { HelpCircle, User2 } from "lucide-react"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { getAvailableCount } from "@/lib/org-limit"
import { MAX_FREE_BOARDS } from "@/constants/boards"
import { checkSubscription } from "@/lib/subscription"

const BoardList = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const boards = await db.board.findMany({
    where: {
      orgId,
      },
      orderBy: {
        createdAt:"desc"
      }
  });

  const availableCount = await getAvailableCount();
  const isPro = await checkSubscription();

  return (
    <div className="space-y-4">
        <div className="flex items-center font-semibold text-lg text-neutral-700">
          <User2 className="h-6 w-6 mr-2" />
          your boards
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 ">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/board/${board.id}`}
              className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
              style={{ backgroundImage: `url(${board.imageThumbUrl})`}}
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition " />
              <p className="relative font-semibold text-white">
                {board.title}
              </p>
            </Link>
          ))}
          <FormPopover side="right" sideOffset={10}>
            <div
              role="button"
              className="aspect-video relative h-full w-full bg-muted rounded-sm flex-col items-center justify-center gap-y-1 hover:opacity-75 transition"
            >
              <p className="text-sm text-center font-bold ">Create new board</p>
              <span className="text-xs font-semibold">
                {isPro ? "Unlimited" : `${MAX_FREE_BOARDS - availableCount} remaining`}
              </span>
              <Hint
                sideOffset={40}
                description={`Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace. `}
              >
                <HelpCircle 
                  className="absolute bottom-2 right-2 h-[14px] w-[14px]"
                />
              </Hint>
            </div>
          </FormPopover>
        </div>
    </div>
  )
}

export default BoardList

BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
    </div>
  );
};