import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FaGithub } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white-800 text-white">
      <div className="flex items-center gap-4">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 hover:text-gray-950 transition-colors "
        >
          <FaGithub size={24} />
        </a>
        <h1 className="text-2xl font-bold text-gray-800">Airstack</h1>
      </div>
      <div className="flex items-center gap-4">
        <ConnectButton />
      </div>
    </header>
  );
}
