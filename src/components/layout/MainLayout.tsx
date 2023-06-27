interface Props {
  children: React.ReactNode;
}

function MainLayout({ children }: Props) {
  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-center">
      {children}
    </main>
  );
}

export default MainLayout;
