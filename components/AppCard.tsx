import Link from "next/link"

export function AppCard({
  app,
}: {
  app: {
    name: string
    description: string
    href: string
    icon: React.ReactNode
    banner?: string
    verb?: string
  }
  }) {
  return (
    <div key={app.name} className="relative overflow-hidden max-w-xs mx-auto px-8 py-6 bg-white shadow md:rounded-lg prose">
      <h3>{app.name}</h3>
      <p className="text-gray-600">{app.description}</p>
      <Link href={app.href} passHref>
        <a
          type="button"
          className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 no-underline"
        >
          {app.icon}
          <span>{app.verb || "Play"}</span>
        </a>
      </Link>
      {app.banner && <div
        className="absolute top-0 px-8 py-0.5 right-0 text-center bg-indigo-500 text-white origin-bottom-right text-sm text-opacity-80"
        style={{ transform: "translateY(-100%) rotate(90deg) translateX(70.71067811865476%) rotate(-45deg)" }}
      >
        {app.banner}
      </div>}
    </div>
  )
}