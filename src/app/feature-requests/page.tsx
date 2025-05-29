export default function FeatureRequestsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Feature Requests
        </h1>

        <div className="bg-card border rounded-lg p-6">
          <p className="text-muted-foreground">
            Feature requests will be displayed here. The app structure is ready!
          </p>

          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              ✅ Next.js 14 App Router
            </p>
            <p className="text-sm text-muted-foreground">✅ TypeScript</p>
            <p className="text-sm text-muted-foreground">✅ Tailwind CSS</p>
            <p className="text-sm text-muted-foreground">✅ FSD Architecture</p>
            <p className="text-sm text-muted-foreground">✅ Firebase Config</p>
            <p className="text-sm text-muted-foreground">
              ✅ shadcn/ui Components
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
