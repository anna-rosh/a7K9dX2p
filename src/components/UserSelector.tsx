import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';

const UserSelector = () => {
  const { currentUser, users, setCurrentUser } = useUser();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Commenting as:</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2">
          {users.map((user) => (
            <Button
              key={user.id}
              variant={currentUser.id === user.id ? 'default' : 'outline'}
              onClick={() => setCurrentUser(user)}
              size="sm"
              className="w-full sm:w-auto"
            >
              {user.firstName} {user.lastName}
            </Button>
          ))}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-3">
          Current user: {currentUser.firstName} {currentUser.lastName}
        </p>
      </CardContent>
    </Card>
  );
};

export default UserSelector;
