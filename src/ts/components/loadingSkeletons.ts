//Altered code from https://flowbite.com/docs/components/skeleton/

export function postCardSkeleton(): string {
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
              </div>
              <div class="flex flex-col gap-1 py-2">
                <div>
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

export function profileCardSkeleton(): string {
  return `
          <div role="status" class="relative animate-pulse">
            <div
              class="profile-banner mb-8 h-[150px] w-full overflow-hidden bg-gray-200 dark:bg-gray-700"
            ></div>
            <div
              class="position: absolute top-[104px] left-[10px] h-[90px] w-[90px] rounded-full border-2 border-white bg-gray-200 dark:bg-gray-700"
            ></div>
            <div class="flex flex-col p-4">
              <div class="flex justify-end"></div>
              <div class="flex flex-col gap-2">
                <div
                  class="mb-4 h-3 max-w-[120px] rounded-full bg-gray-200 dark:bg-gray-700"
                ></div>
                <div
                  class="mb-4 h-2.5 max-w-[500px] rounded-full bg-gray-200 dark:bg-gray-700"
                ></div>
                <div
                  class="mb-2.5 h-2 max-w-[280px] rounded-full bg-gray-200 dark:bg-gray-700"
                ></div>
              </div>
            </div>
          </div>
`;
}

export function profileListSkeleton(): string {
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
              </div>
              <div class="flex flex-col gap-1 py-2">
                <div>
                  <div
                    class="mb-2.5 h-2 max-w-[460px] rounded-full bg-gray-200 dark:bg-gray-700"
                  ></div>
                </div>
              </div>
            </div>
          </div>
`;
}

export function navbarSkeleton(): string {
  return `
          <div
            role="status"
            class="hidden animate-pulse gap-4 p-8 sm:static sm:flex sm:flex-col sm:w-[256px]"
          >
            <div class="mb-4 flex items-start gap-1">
              <div
                class="mr-4 h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"
              ></div>
              <div class="grow">
                <div
                  class="my-2 h-3 max-w-[100px] rounded-full bg-gray-200 dark:bg-gray-700"
                ></div>
              </div>
            </div>
            <div
              class="mb-2.5 h-2.5 max-w-[80px] rounded-full bg-gray-200 dark:bg-gray-700"
            ></div>
            <div
              class="mb-2.5 h-2.5 max-w-[80px] rounded-full bg-gray-200 dark:bg-gray-700"
            ></div>
            <div
              class="mb-2.5 h-2.5 max-w-[80px] rounded-full bg-gray-200 dark:bg-gray-700"
            ></div>
            <div
              class="mb-2.5 h-2.5 max-w-[80px] rounded-full bg-gray-200 dark:bg-gray-700"
            ></div>
          </div>
`;
}
