"use client";

import React, { useState, useEffect } from "react";
import { useNotificationStore } from "@/store/notification";
import notificationsService from "@/services/notifications";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, Inbox, ArrowLeft, ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NotificationListResponse {
  data: any[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    unreadCount: number;
  };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [meta, setMeta] = useState<NotificationListResponse["meta"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterUnread, setFilterUnread] = useState<"all" | "unread">("all");

  const globalMarkAsRead = useNotificationStore((state) => state.markAsRead);
  const globalMarkAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const globalFetchNotifications = useNotificationStore((state) => state.fetchNotifications);

  const fetchNotifications = async (currentPage: number, currentSort: "asc" | "desc", currentFilter: "all" | "unread") => {
    try {
      setLoading(true);
      const res = await notificationsService.getNotifications({
        page: currentPage,
        limit: 10,
        sortOrder: currentSort,
        isRead: currentFilter === "unread" ? false : undefined,
      });
      setNotifications(res.data);
      setMeta(res.meta);
      
      // Also update the global header store so unread badge stays in sync
      if (currentPage === 1 && currentFilter === "all") {
        globalFetchNotifications();
      }
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(page, sortOrder, filterUnread);
  }, [page, sortOrder, filterUnread]);

  const handleMarkAsRead = async (id: string, currentlyRead: boolean) => {
    if (currentlyRead) return;
    try {
      await globalMarkAsRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await globalMarkAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            Your Notifications
          </h1>
          <p className="text-muted-foreground mt-2">
            Stay updated with all activities and alerts on your account.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-primary/20 hover:bg-primary/5"
            onClick={handleMarkAllAsRead}
          >
            <CheckCheck className="w-4 h-4 text-primary" />
            Mark all as read
          </Button>
        </div>
      </div>

      <Card className="border-border/50 shadow-md">
        <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              Filter & Sort
            </CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={filterUnread} onValueChange={(val: any) => { setFilterUnread(val); setPage(1); }}>
                <SelectTrigger className="w-[140px] bg-background">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread Only</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={(val: any) => { setSortOrder(val); setPage(1); }}>
                <SelectTrigger className="w-[140px] bg-background">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No notifications found</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                You're all caught up! When you receive new notifications, they will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {notifications.map((notification, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={notification._id}
                  onClick={() => handleMarkAsRead(notification._id, notification.read)}
                  className={cn(
                    "p-5 hover:bg-muted/30 transition-colors cursor-pointer flex items-start gap-4",
                    !notification.read ? "bg-primary/5" : ""
                  )}
                >
                  <div className="mt-1">
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full mt-1.5",
                      !notification.read ? "bg-primary animate-pulse" : "bg-transparent"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                      <h4 className={cn("text-base font-semibold truncate", !notification.read ? "text-foreground" : "text-foreground/80")}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className={cn("text-sm", !notification.read ? "text-foreground/90 font-medium" : "text-muted-foreground")}>
                      {notification.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && meta && meta.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 p-4 bg-card border border-border/50 rounded-xl shadow-sm">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{((page - 1) * meta.limit) + 1}</span> to{" "}
            <span className="font-medium text-foreground">{Math.min(page * meta.limit, meta.total)}</span> of{" "}
            <span className="font-medium text-foreground">{meta.total}</span> entries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                let pageNum = page;
                if (page < 3) pageNum = i + 1;
                else if (page > meta.totalPages - 2) pageNum = meta.totalPages - 4 + i;
                else pageNum = page - 2 + i;
                
                if (pageNum < 1 || pageNum > meta.totalPages) return null;

                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className={cn("w-10 h-10 p-0", page === pageNum ? "bg-primary text-primary-foreground" : "")}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="w-10 h-10 p-0"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
