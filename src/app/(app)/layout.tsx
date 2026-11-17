export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <p className="member">Khu vực thành viên</p>
      {children}
    </>
  );
}
