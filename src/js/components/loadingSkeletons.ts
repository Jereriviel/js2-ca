//Altered code from https://flowbite.com/docs/components/skeleton/

export function cardSkeleton(): string {
  return `
<div role="status" class="flex animate-pulse pt-4">
            <div>
              <div
                class="mr-4 h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"
              ></div>
            </div>
            <div class="flex grow flex-col">
              <div>
                <div
                  class="mb-2 h-2.5 max-w-[100px] rounded-full bg-gray-200 dark:bg-gray-700"
                ></div>
                <div
                  class="mb-2.5 h-2 max-w-[60px] rounded-full bg-gray-200 dark:bg-gray-700"
                ></div>
              </div>
              <div class="flex flex-col gap-1 py-2">
                <div
                  class="mb-2 h-2.5 max-w-[200px] rounded-full bg-gray-200 dark:bg-gray-700"
                ></div>
                <div>
                  <div
                    class="mb-2.5 h-2 max-w-[460px] rounded-full bg-gray-200 dark:bg-gray-700"
                  ></div>
                  <div
                    class="mb-2.5 h-2 max-w-[460px] rounded-full bg-gray-200 dark:bg-gray-700"
                  ></div>
                  <div
                    class="mb-2.5 h-2 max-w-[460px] rounded-full bg-gray-200 dark:bg-gray-700"
                  ></div>
                </div>
              </div>
              <div>
                <div
                  class="mb-2.5 h-2 max-w-[80px] rounded-full bg-gray-200 dark:bg-gray-700"
                ></div>
              </div>
            </div>
          </div>
`;
}

export function commentSkeleton(): string {
  return `
<div role="status" class="max-w-sm animate-pulse">
    <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
    <span class="sr-only">Loading...</span>
</div>
`;
}

export function profileSkeleton(): string {
  return `
<div role="status" class="max-w-sm animate-pulse">
    <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
    <span class="sr-only">Loading...</span>
</div>
`;
}

export function profileListSkeleton(): string {
  return `
<div role="status" class="max-w-sm animate-pulse">
    <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
    <span class="sr-only">Loading...</span>
</div>
`;
}
