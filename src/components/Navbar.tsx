const Navbar = () => {
  return (
    <nav className="flex p-5 border-b-gray-500 border-b-1 h-14 w-full">
      <div className="flex gap-4 items-center">
        <img src="/download.png" className="h-8 w-8" alt="Wordle logo" />
        <h1 className="text-white font-bold">Wordle</h1>
      </div>
    </nav>
  );
};

export default Navbar;
