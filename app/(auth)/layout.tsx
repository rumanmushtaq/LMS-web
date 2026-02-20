import LeftPanel from "@/components/organisms/Auth/LeftPanel";


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <LeftPanel />
      <div className="flex items-center justify-center p-8">
       {children}
      </div>
    </div>
  );
}