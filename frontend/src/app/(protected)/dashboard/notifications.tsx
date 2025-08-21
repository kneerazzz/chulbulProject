'use client'
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/app/components/ui/sheet"
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Badge } from "@/app/components/ui/badge";
import {
  Bell,
  Check,
  Trash,
  Filter,
  Clock,
  MailOpen,
  AlertCircle,
  Trophy,
  BookOpen,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Skeleton } from "@/app/components/ui/skeleton";

// Define the Notification interface
interface Notification {
  _id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type?: string;
}

interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NotificationDrawer({ open, onOpenChange }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications based on active tab

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = "/api/notifications/get-notifications";
      if (activeTab === "unread") {
        endpoint = "/api/notifications/unread-notifications";
      } else if (activeTab === "today") {
        endpoint = "/api/notifications/today-notifications";
      }

      const res = await axios.get(endpoint, { withCredentials: true });
      setNotifications(res.data.data || []);

      if (activeTab === "all") {
        const unread = (res.data.data || []).filter((n: Notification) => !n.isRead);
        setUnreadCount(unread.length);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]); // depends on activeTab

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, activeTab, fetchNotifications]);

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      // Optimistically update local state
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);

      await axios.patch("/api/notifications/mark-all-read", {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
      // Optionally: fetchNotifications() here to recover state if API failed
    }
  };


  // Mark single as read
  const markAsRead = async (id: string) => {
    try {
      setNotifications(prev => {
        const notif = prev.find(n => n._id === id);

        // Only decrement if it was unread
        if (notif && !notif.isRead) {
          setUnreadCount(count => Math.max(0, count - 1));
        }

        return prev.map(n => n._id === id ? { ...n, isRead: true } : n);
      });

      await axios.patch(`/api/notifications/mark-read?id=${id}`);
    } catch (err) {
      console.error(err);
    }
  };


  // Delete notification
    const deleteNotification = async (id: string) => {
      try {
        setNotifications(prev => {
          const deletedNotif = prev.find(n => n._id === id);
          if (deletedNotif && !deletedNotif.isRead) {
            setUnreadCount(prevCount => Math.max(0, prevCount - 1));
          }
          return prev.filter(n => n._id !== id);
        });

        await axios.delete(`/api/notifications/delete-notification?id=${id}`);
      } catch (err) {
        console.error(err);
      }
    };


  // Get notification icon based on type
  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'progress':
        return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'system':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  if(open){
    fetchNotifications()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[500px] flex flex-col">
        <SheetHeader className="text-left border-b">
          <div className="flex justify-between items-center">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </SheetTitle>
              <SheetDescription>
                Manage your notifications
              </SheetDescription>
            </div>
            {notifications.length > 0 && unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="flex items-center gap-1"
              >
                <MailOpen className="h-4 w-4" />
                Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex items-center gap-1">
                {unreadCount > 0 ? (
                  <Badge variant="destructive" className="h-4 w-4 p-0 text-xs">
                    {unreadCount}
                  </Badge>
                ) : (
                  <MailOpen className="h-4 w-4" />
                )}
                Unread
              </TabsTrigger>
              <TabsTrigger value="today" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Today
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <NotificationList 
                notifications={notifications}
                loading={loading}
                markAsRead={markAsRead}
                deleteNotification={deleteNotification}
                getNotificationIcon={getNotificationIcon}
              />
            </TabsContent>

            <TabsContent value="unread" className="mt-0">
              <NotificationList 
                notifications={notifications.filter(n => !n.isRead)}
                loading={loading}
                markAsRead={markAsRead}
                deleteNotification={deleteNotification}
                getNotificationIcon={getNotificationIcon}
              />
            </TabsContent>

            <TabsContent value="today" className="mt-0">
              <NotificationList 
                notifications={notifications}
                loading={loading}
                markAsRead={markAsRead}
                deleteNotification={deleteNotification}
                getNotificationIcon={getNotificationIcon}
              />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  getNotificationIcon: (type?: string) => React.ReactElement;
}

function NotificationList({ 
  notifications, 
  loading, 
  markAsRead, 
  deleteNotification, 
  getNotificationIcon 
}: NotificationListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-3 rounded-lg border flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-sm text-muted-foreground">
          No notifications found.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[80vh] pr-4">
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={cn(
              "p-3 rounded-lg border flex items-start gap-3 transition-colors",
              !notification.isRead && "bg-muted/50 border-l-4 border-l-primary"
            )}
          >
            <div className="mt-1">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-1">
              {!notification.isRead && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => markAsRead(notification._id)}
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => deleteNotification(notification._id)}
                title="Delete notification"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}