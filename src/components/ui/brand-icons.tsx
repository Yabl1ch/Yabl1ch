

/** Official Telegram Logo with stylized gradient and glowing ring */
export function TelegramBrandAvatar({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <div
      className={`relative rounded-full p-0.5 bg-gradient-to-tr from-[#0088cc] via-[#22c55e] to-[#29b6f6] ring-2 ring-emerald-500/50 shadow-[0_0_15px_rgba(34,197,94,0.35)] group-hover:ring-emerald-400 group-hover:shadow-[0_0_22px_rgba(74,222,128,0.55)] transition-all shrink-0 ${className}`}
    >
      <div className="h-full w-full rounded-full bg-gradient-to-b from-[#24A1DE] to-[#1785BC] flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 24 24"
          className="h-3/5 w-3/5 text-white translate-x-[-1px] translate-y-[0.5px]"
          fill="currentColor"
        >
          <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.67c.458 0 .66-.21.916-.458l2.2-2.138 4.576 3.38c.843.465 1.449.225 1.659-.783l3-14.138c.308-1.233-.473-1.794-1.412-1.5z" />
        </svg>
      </div>
    </div>
  );
}

/** Official Discord Clyde Logo with stylized gradient and glowing ring */
export function DiscordBrandAvatar({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <div
      className={`relative rounded-full p-0.5 bg-gradient-to-tr from-[#5865F2] via-[#22c55e] to-[#7289da] ring-2 ring-emerald-500/50 shadow-[0_0_15px_rgba(34,197,94,0.35)] group-hover:ring-emerald-400 group-hover:shadow-[0_0_22px_rgba(74,222,128,0.55)] transition-all shrink-0 ${className}`}
    >
      <div className="h-full w-full rounded-full bg-gradient-to-b from-[#5865F2] to-[#4752C4] flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 24 24"
          className="h-3/5 w-3/5 text-white"
          fill="currentColor"
        >
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      </div>
    </div>
  );
}

/** Official GitHub Octocat Logo with crisp white circular contour and zoomed-in icon */
export function GithubBrandAvatar({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <div
      className={`relative rounded-full p-0.5 border-2 border-white ring-2 ring-white/40 shadow-[0_0_16px_rgba(255,255,255,0.35)] group-hover:border-white group-hover:ring-white/80 group-hover:shadow-[0_0_24px_rgba(255,255,255,0.6)] transition-all shrink-0 ${className}`}
    >
      <div className="h-full w-full rounded-full bg-[#0e1117] flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 24 24"
          className="h-[82%] w-[82%] text-white"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      </div>
    </div>
  );
}
