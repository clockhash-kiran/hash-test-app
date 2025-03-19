import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Session } from "next-auth"; // Import session type

const Page = async () => {
    const session: Session | null = await getServerSession(authOptions);

    return (
        <div>
            {session?.user?.name ? (
                <>
                    <p>Welcome, {session.user.name}</p>
                    {session?.user?.role && (
                        
                        <p>Role: {session.user.role}</p>
                    )}
                </>
            ) : (
                <p>Not Logged In</p>
            )}
        </div>
    );
};

export default Page;
