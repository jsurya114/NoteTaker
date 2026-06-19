import Link from "next/link";
import { FileText, Shield, Clock, Share2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
              <FileText className="h-8 w-8 text-indigo-600" />
              <span className="font-bold text-xl text-gray-900">NoteTaker</span>
            </a>
          </div>
          <div className="flex flex-1 justify-end gap-4 items-center">
            <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900">
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      <main className="isolate">
        {/* Hero section */}
        <div className="relative pt-14">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <div className="py-24 sm:py-32 lg:pb-40">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Share notes securely with anyone, anywhere.
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  NoteTaker allows you to create end-to-end secure notes that self-destruct, expire, or require passwords to view. Stop sharing secrets in plain text.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Link
                    href="/register"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get started
                  </Link>
                  <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900">
                    Already have an account? <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature section */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24 sm:pb-32">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to share secrets safely
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Shield className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Password Protected
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Secure your notes with a custom password. Only those with the exact key can unlock and read your messages.
                </dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Share2 className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  One-Time Views
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Send notes that instantly self-destruct the moment they are opened. Ensure your data isn't sitting in an inbox forever.
                </dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Clock className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Time-Based Expiry
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Set a specific date and time for your notes to automatically expire. You can also revoke access manually at any time.
                </dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <FileText className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Manage Everything
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  A beautiful dashboard allows you to track view counts, statuses, and manage your active secret links easily.
                </dd>
              </div>

            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}
