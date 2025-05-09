
import { UserProfile } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileTabProps {
  profile: UserProfile;
  walletAddress: string | null;
  handleProfileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileTab = ({ profile, walletAddress, handleProfileChange }: ProfileTabProps) => {
  return (
    <div className="space-y-4 py-4">
      {walletAddress && (
        <div className="p-3 bg-muted rounded-md">
          <Label className="text-xs text-muted-foreground">Connected Wallet</Label>
          <p className="font-mono text-sm mt-1">
            {walletAddress}
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          value={profile.username}
          onChange={handleProfileChange}
          placeholder="Enter a username"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          name="full_name"
          value={profile.full_name}
          onChange={handleProfileChange}
          placeholder="Enter your full name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="avatar_url">Avatar URL</Label>
        <Input
          id="avatar_url"
          name="avatar_url"
          value={profile.avatar_url}
          onChange={handleProfileChange}
          placeholder="Enter avatar URL"
        />
        {profile.avatar_url && (
          <div className="mt-2 flex justify-center">
            <img
              src={profile.avatar_url}
              alt="Avatar preview"
              className="h-16 w-16 rounded-full object-cover border border-border"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + (profile.username || 'User');
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
