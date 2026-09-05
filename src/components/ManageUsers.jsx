"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Switch } from "@heroui/react";
import { FiSearch } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchUsers = async () => {
        try {
            const { data: tokenData } = await authClient.token();
            const token = tokenData?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            // console.log("users fetched:", result);
            setUsers(result.users || []);
        } catch (error) {
            console.error("fetchUsers error:", error);
            showToast.error("Could not reach the server, please try again");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    // manual fallback: stripe checkout theke auto upgrade fail hole admin ekhan theke tik kore dite parbe
    const togglePremium = async (userId, isPremium) => {
        try {
            const { data: tokenData } = await authClient.token();
            const token = tokenData?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/users/${userId}/premium`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ isPremium })
            });
            const result = await res.json();
            // console.log("result", result)

            if (res.ok && result.success) {
                showToast.success(result.message);
                fetchUsers(); 
            } else {
                showToast.error("Could not update this user");
            }
        } catch (error) {
            console.error("togglePremium error:", error);
            showToast.error("Could not reach the server, please try again");
        }
    }

    const filteredUsers = users.filter((u) => {
        const query = search.toLowerCase();
        return u.name?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query);
    });

    if (loading) {
        return <LoadingSpinner></LoadingSpinner>;
    }

    return (
        <div>
            <p className="text-xs text-dll-muted">Dashboard</p>
            <h1 className="font-serif text-xl font-semibold text-dll-heading mb-1">Manage Users</h1>
            <p className="text-sm text-dll-muted mb-6">Use the Plan switch as a manual fallback if a Premium upgrade doesn&apos;t go through automatically.</p>

            <div className="bg-dll-surface rounded-2xl border border-dll-border p-5 mb-6">
                <div className="relative max-w-sm">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dll-muted" size={16}></FiSearch>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-3 py-2 rounded-xl border border-dll-border bg-transparent text-sm text-dll-text focus:outline-none focus:border-dll-accent"
                    ></input>
                </div>
            </div>

            <div className="bg-dll-surface rounded-2xl border border-dll-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="border-b border-dll-border bg-dll-surface-alt">
                                <th className="text-left py-3 px-6 text-xs font-semibold text-dll-muted uppercase">User</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-dll-muted uppercase">Joined</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-dll-muted uppercase">Role</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-dll-muted uppercase">Plan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dll-border">
                            {filteredUsers.length === 0 &&
                                <tr>
                                    <td colSpan={4} className="text-center py-10 text-sm text-dll-muted">No users found</td>
                                </tr>
                            }
                            {filteredUsers.map((u) => (
                                <tr key={u._id} className="hover:bg-dll-surface-alt/50">
                                    <td className="py-3 px-6">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Image
                                                src={u.image || "https://i.pravatar.cc/100"}
                                                alt={u.name}
                                                width={32}
                                                height={32}
                                                className="rounded-full object-cover"
                                            ></Image>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-dll-heading truncate max-w-[220px]">{u.name}</p>
                                                <p className="text-xs text-dll-muted truncate max-w-[220px]">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-dll-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">
                                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-dll-primary/10 text-dll-primary capitalize">{u.role}</span>
                                    </td>
                                    <td className="py-3 px-6">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                size="sm"
                                                isSelected={u.isPremium || false}
                                                onChange={(checked) => togglePremium(u._id, checked)}
                                            >
                                                <Switch.Content>
                                                    <Switch.Control>
                                                        <Switch.Thumb></Switch.Thumb>
                                                    </Switch.Control>
                                                </Switch.Content>
                                            </Switch>
                                            <span className="text-xs text-dll-muted">{u.isPremium ? "Premium" : "Free"}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
