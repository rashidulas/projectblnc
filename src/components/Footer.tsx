'use client';

export default function Footer() {
  return (
    <footer className="bg-[#e7ebea]" style={{ boxShadow: '0 -1px 0 rgba(0,0,0,0.06)' }}>
      <div className="font-mono py-5 text-center text-[12px] text-neutral-500 tracking-widest">
        © {new Date().getFullYear()} BLANC
      </div>
    </footer>
  );
}
