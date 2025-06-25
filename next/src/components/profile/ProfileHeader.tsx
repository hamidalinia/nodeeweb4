import Image from 'next/image';

export default function ProfileHeader({ user }) {
    return (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 py-12 text-white">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center">
                <div className="relative w-24 h-24 rounded-full border-4 border-white/30 overflow-hidden">
                    <Image
                        src={user.avatar || '/default-avatar.png'}
                        alt="Profile"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <p className="text-indigo-100">{user.email}</p>
                    <div className="flex mt-2 gap-2 flex-wrap justify-center sm:justify-start">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              Member since {new Date(user.joinDate).getFullYear()}
            </span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {user.ordersCount} Orders
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
}