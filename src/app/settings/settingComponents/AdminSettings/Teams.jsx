"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Plus, MoreVertical, ChevronUp, ChevronDown, Edit2, X, FolderInput, Trash2 } from 'lucide-react'

export default function TeamsView() {

    const C = {
        title: "text-xs font-sans font-medium text-gray-700",
        itemTitle: "text-[12px] font-medium text-gray-900",
        subtitle: "text-[11px] text-gray-500",
        caption: "text-[10px] text-gray-500",
        badge: "px-2.5 py-1 bg-[#7c3aed] text-white rounded-md text-[10px] font-medium inline-block",
        btnText: "text-[10px]",
        drawerTitle: "text-sm font-bold text-gray-700",
        formText: "text-xs"
    }

    // Available users ab hard-coded nahi; existing Users API se aate hain.
    const [availableUsers, setAvailableUsers] = useState([])
    const [usersLoading, setUsersLoading] = useState(true)

    const [teams, setTeams] = useState([])
    const [loading, setLoading] = useState(true)

    const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false)

    // Create Team Form States
    const [teamName, setTeamName] = useState("")
    const [teamAdmin, setTeamAdmin] = useState("")
    const [selectedMembers, setSelectedMembers] = useState([])
    const [teamStatus, setTeamStatus] = useState("Active")
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    // Edit Team States
    const [editingTeam, setEditingTeam] = useState(null)
    const [editTeamName, setEditTeamName] = useState("")
    const [editTeamAdmin, setEditTeamAdmin] = useState("")
    const [editSelectedMembers, setEditSelectedMembers] = useState([])
    const [editTeamStatus, setEditTeamStatus] = useState("Active")
    const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false)

    // Member Action Menu & Move Modal States
    const [activeMenu, setActiveMenu] = useState(null)
    const [moveModalData, setMoveModalData] = useState(null)
    const [targetTeamId, setTargetTeamId] = useState("")
    const [isMoveDropdownOpen, setIsMoveDropdownOpen] = useState(false)

    const menuRef = useRef(null)

    // Database se teams fetch karo
    const getTeams = async () => {
        try {
            const response = await fetch("/api/auth/teams");
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Teams fetch nahi ho sakin.");
            }

            // MongoDB IDs ko frontend ke id field mein convert karo
            const formattedTeams = result.data.map((team) => ({
                ...team,
                id: team._id,
                stats: {
                    members: team.members?.length || 0,
                    openJobs: team.stats?.openJobs || 0,
                    closedJobs: team.stats?.closedJobs || 0,
                    archivedJobs: team.stats?.archivedJobs || 0
                },
                members: (team.members || []).map((member) => ({
                    ...member,
                    id: member._id,
                    initials: member.initials || getInitials(member.name)
                }))
            }));

            setTeams(formattedTeams);
        } catch (error) {
            console.error("Get teams error:", error);
            alert(error.message || "Teams load nahi ho sakin.");
        } finally {
            setLoading(false);
        }
    };

    // Team update API ko common function se call karo
    const saveTeam = async (teamId, data) => {
        const response = await fetch(`/api/auth/teams/${teamId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Team update nahi ho saki.");
        }

        return result.data;
    };

    // Invite kiye gaye users ko existing API se load karo.
    const getAvailableUsers = async () => {
        try {
            const response = await fetch("/api/auth/users");
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Users load nahi ho sake.");
            }

            const formattedUsers = (result.users || []).map((user) => {
                const name = user.name || [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "Unnamed User";
                return {
                    ...user,
                    id: user.id || user._id,
                    name,
                    job: user.job || user.jobTitle || "Not Available",
                    email: user.email || "",
                    inviteStatus: user.status || "Pending"
                };
            }).filter((user) => user.id);

            setAvailableUsers(formattedUsers);
        } catch (error) {
            console.error("Get available users error:", error);
            alert(error.message || "Invited users load nahi ho sake.");
        } finally {
            setUsersLoading(false);
        }
    };

    useEffect(() => {
        getTeams();
        getAvailableUsers();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const toggleTeam = (id) => {
        // Accordion open/close filhaal sirf UI state hai
        setTeams((previousTeams) => previousTeams.map((team) =>
            team.id === id ? { ...team, isOpen: !team.isOpen } : team
        ));
    }

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : "TM"
    }

    // Handle Create Team: API ke through database mein save karo
    const handleCreateTeam = async () => {

        console.log("========== CREATE TEAM START ==========");

        console.log("Team Name:", teamName);
        console.log("Team Admin:", teamAdmin);
        console.log("Selected Members:", selectedMembers);
        console.log("Team Status:", teamStatus);

        if (!teamName.trim()) {
            console.log("ERROR: Team name empty hai.");
            alert("Team name is required.");
            return;
        }

        const adminName = teamAdmin.trim() || "Team Admin";

        console.log("Admin Name:", adminName);

        const adminObj = {
            name: adminName,
            job: "Not Available",
            initials: getInitials(adminName),
            role: "Administrator",
            status: teamStatus
        };

        console.log("Admin Object:", adminObj);

        const memberObjects = selectedMembers.map((member) => ({
            name: member.name,
            job: member.job || "Not Available",
            initials: getInitials(member.name),
            role: "Member",
            status: teamStatus
        }));

        console.log("Member Objects:", memberObjects);

        const requestBody = {
            name: teamName.trim(),
            subtitle: "",
            status: teamStatus,
            members: [adminObj, ...memberObjects]
        };

        console.log("========== REQUEST BODY ==========");
        console.log(requestBody);

        try {

            console.log("Sending POST request to /api/auth/teams...");

            const response = await fetch("/api/auth/teams", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            console.log("Response Status:", response.status);
            console.log("Response OK:", response.ok);

            const result = await response.json();

            console.log("========== API RESPONSE ==========");
            console.log("API Result:", result);

            if (!response.ok || !result.success) {
                console.log("CREATE TEAM FAILED");
                console.log("Error Message:", result.message);

                throw new Error(
                    result.message || "Team create nahi hui."
                );
            }

            console.log("CREATE TEAM SUCCESS");
            console.log("Created Team:", result.data);

            console.log("Refreshing teams...");

            await getTeams();

            console.log("Teams refreshed successfully.");

            setTeamName("");
            setTeamAdmin("");
            setSelectedMembers([]);
            setTeamStatus("Active");
            setIsCreateTeamOpen(false);
            setIsDropdownOpen(false);

            console.log("Form reset successfully.");
            console.log("========== CREATE TEAM END ==========");

        } catch (error) {

            console.error("========== CREATE TEAM ERROR ==========");
            console.error("Error:", error);
            console.error("Error Message:", error.message);

            alert(error.message || "Team create karte waqt error aaya.");
        }
    };

    // Open Edit Team Modal & populate data
    const handleOpenEditModal = (team) => {
        setEditingTeam(team)
        setEditTeamName(team.name)

        // Find admin from team members
        const adminMember = team.members.find(m => m.role === "Administrator")
        setEditTeamAdmin(adminMember ? adminMember.name : "")

        // Find standard members
        const standardMembers = team.members
            .filter(m => m.role !== "Administrator")
            .map(m => ({ id: m.id, name: m.name, job: m.job }))

        setEditSelectedMembers(standardMembers)
        setEditTeamStatus(team.status || "Active")
    }

    // Handle Update Team: API mein changes save karo
    const handleUpdateTeam = async () => {
        if (!editingTeam || !editTeamName.trim()) {
            alert("Team name is required.");
            return;
        }

        const adminName = editTeamAdmin.trim() || "Team Admin";
        const adminObj = {
            name: adminName,
            job: "Not Available",
            initials: getInitials(adminName),
            role: "Administrator",
            status: editTeamStatus
        };

        const memberObjects = editSelectedMembers.map((member) => ({
            name: member.name,
            job: member.job || "Not Available",
            initials: getInitials(member.name),
            role: "Member",
            status: editTeamStatus
        }));

        try {
            await saveTeam(editingTeam.id, {
                name: editTeamName.trim(),
                subtitle: editingTeam.subtitle || "",
                status: editTeamStatus,
                members: [adminObj, ...memberObjects]
            });

            await getTeams();
            setEditingTeam(null);
            setIsEditDropdownOpen(false);
        } catch (error) {
            console.error("Update team error:", error);
            alert(error.message || "Team update nahi ho saki.");
        }
    }

    // Member ko ek team se doosri team mein move karo
    const handleMoveMemberConfirm = async () => {
        if (!targetTeamId || !moveModalData) {
            alert("Please team select karein.");
            return;
        }

        const sourceTeam = teams.find((team) => team.id === moveModalData.sourceTeamId);
        const targetTeam = teams.find((team) => team.id === targetTeamId);
        const member = moveModalData.member;

        if (!sourceTeam || !targetTeam) {
            alert("Team nahi mili.");
            return;
        }

        if (sourceTeam.id === targetTeam.id) {
            setMoveModalData(null);
            return;
        }

        if (targetTeam.members.some((item) => item.name === member.name)) {
            alert("Ye member pehle se target team mein hai.");
            return;
        }

        try {
            await saveTeam(sourceTeam.id, {
                name: sourceTeam.name,
                subtitle: sourceTeam.subtitle || "",
                status: sourceTeam.status,
                members: sourceTeam.members
                    .filter((item) => item.id !== member.id)
                    .map(({ name, job, initials, role, status }) => ({ name, job, initials, role, status }))
            });

            await saveTeam(targetTeam.id, {
                name: targetTeam.name,
                subtitle: targetTeam.subtitle || "",
                status: targetTeam.status,
                members: [...targetTeam.members, member]
                    .map(({ name, job, initials, role, status }) => ({ name, job, initials, role, status }))
            });

            await getTeams();
            setMoveModalData(null);
            setTargetTeamId("");
            setIsMoveDropdownOpen(false);
        } catch (error) {
            console.error("Move member error:", error);
            alert(error.message || "Member move nahi ho saka.");
            await getTeams();
        }
    }

    // Member ko team se delete karo aur database update karo
    const handleDeleteMember = async (teamId, memberId) => {
        const team = teams.find((item) => item.id === teamId);
        if (!team) return;

        try {
            await saveTeam(teamId, {
                name: team.name,
                subtitle: team.subtitle || "",
                status: team.status,
                members: team.members
                    .filter((member) => member.id !== memberId)
                    .map(({ name, job, initials, role, status }) => ({ name, job, initials, role, status }))
            });

            await getTeams();
            setActiveMenu(null);
        } catch (error) {
            console.error("Delete member error:", error);
            alert(error.message || "Member delete nahi ho saka.");
        }
    }

    return (
        <div className="p-2 mt-2.5 font-sans max-w-7xl mx-auto bg-gray-50/25 relative">

            {/* Top Create Team Button */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setIsCreateTeamOpen(true)}
                    className="bg-[#7c3aed] px-4 py-2 rounded-lg flex items-center text-white gap-2 cursor-pointer hover:bg-[#6d28d9] transition-colors shadow-xs"
                >
                    <Plus size={16} />
                    <span className={C.btnText}>Create Team</span>
                </button>
            </div>

            {/* Teams Cards List */}
            {loading ? (
                <div className="py-10 text-center text-sm text-gray-500">Loading teams...</div>
            ) : teams.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl bg-white">
                    Still no team created.Click on create button to create your custom team.
                </div>
            ) : (
                <div className="space-y-5">
                    {teams.map((team) => (
                        <div key={team.id} className="border border-gray-200 rounded-xl bg-white shadow-xs overflow-visible">

                            {/* Team Header Bar */}
                            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
                                <div className="flex flex-col">
                                    <span className={C.title}>{team.name}</span>
                                    {team.subtitle && <span className={C.subtitle}>{team.subtitle}</span>}
                                </div>

                                <div className="flex items-center gap-8 md:gap-12 text-center">
                                    <div>
                                        <div className={C.title}>{team.stats?.members ?? team.members?.length ?? 0}</div>
                                        <div className={C.caption}>Members</div>
                                    </div>
                                    <div>
                                        <div className={C.title}>{team.stats?.openJobs ?? 0}</div>
                                        <div className={C.caption}>Open Jobs</div>
                                    </div>
                                    <div>
                                        <div className={C.title}>{team.stats?.closedJobs ?? 0}</div>
                                        <div className={C.caption}>Closed Jobs</div>
                                    </div>
                                    <div>
                                        <div className={C.title}>{team.stats?.archivedJobs ?? 0}</div>
                                        <div className={C.caption}>Archived Jobs</div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleOpenEditModal(team)}
                                            className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => toggleTeam(team.id)}
                                            className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                                        >
                                            {team.isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Team Members Accordion Body */}
                            {team.isOpen && (
                                <div className="divide-y divide-gray-100 bg-white">
                                    {(team.members || []).map((member) => (
                                        <div key={member.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50 transition-colors relative">

                                            {/* Member Info */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs shrink-0">
                                                    {member.initials}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={C.itemTitle}>{member.name}</span>
                                                    <span className={C.subtitle}>{member.job}</span>
                                                </div>
                                            </div>

                                            {/* Role & Status Actions */}
                                            <div className="flex items-center gap-4 relative">
                                                <span className={C.badge}>
                                                    {member.role}
                                                </span>
                                                <span className={C.badge}>
                                                    {member.status}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveMenu(activeMenu?.memberId === member.id ? null : { teamId: team.id, memberId: member.id })
                                                    }}
                                                    className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                                                >
                                                    <MoreVertical size={16} />
                                                </button>

                                                {/* Three Dots Popup Menu */}
                                                {activeMenu?.memberId === member.id && (
                                                    <div
                                                        ref={menuRef}
                                                        className="absolute right-0 top-10 w-28 bg-white border z-[9999] border-gray-200 rounded-lg shadow-xl py-1 text-left"
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                setMoveModalData({ sourceTeamId: team.id, member })
                                                                setTargetTeamId("")
                                                                setActiveMenu(null)
                                                            }}
                                                            className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors cursor-pointer"
                                                        >
                                                            <FolderInput size={13} className="text-gray-500" />
                                                            Move
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteMember(team.id, member.id)}
                                                            className="w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                                                        >
                                                            <Trash2 size={13} className="text-red-500" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            )}

            {/* Edit Team Slide-over Modal */}
            {editingTeam && (
                <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 flex justify-end">
                    <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">

                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h2 className={C.drawerTitle}>Edit Team</h2>
                            <button
                                onClick={() => setEditingTeam(null)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body Form */}
                        <div className={`p-6 space-y-5 ${C.formText} flex-1`}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Team Name *</label>
                                    <input
                                        type="text"
                                        value={editTeamName}
                                        onChange={(e) => setEditTeamName(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#7c3aed]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Team Admin Name *</label>
                                    <input
                                        type="text"
                                        value={editTeamAdmin}
                                        onChange={(e) => setEditTeamAdmin(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#7c3aed]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <label className="block text-gray-700 font-medium mb-1">Team Members</label>

                                    <div
                                        onClick={() => setIsEditDropdownOpen(!isEditDropdownOpen)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white flex items-center justify-between cursor-pointer min-h-[40px]"
                                    >
                                        <span className="text-gray-400">Select Team Members</span>
                                        <ChevronDown size={14} className="text-gray-400 shrink-0" />
                                    </div>

                                    {isEditDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                                            {usersLoading ? (
                                                <div className="px-3 py-2 text-xs text-gray-400">Loading invited users...</div>
                                            ) : availableUsers.length === 0 ? (
                                                <div className="px-3 py-2 text-xs text-gray-400">Abhi koi invited user available nahi hai.</div>
                                            ) : availableUsers.map(user => (
                                                <div
                                                    key={user.id}
                                                    onClick={() => {
                                                        if (!editSelectedMembers.some(m => m.name === user.name)) {
                                                            setEditSelectedMembers([...editSelectedMembers, user])
                                                        }
                                                        setIsEditDropdownOpen(false)
                                                    }}
                                                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex flex-col border-b border-gray-50 last:border-none"
                                                >
                                                    <span className="font-medium text-gray-800">{user.name}</span>
                                                    <span className="text-[10px] text-gray-400">{user.email}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Team Status</label>
                                    <select
                                        value={editTeamStatus}
                                        onChange={(e) => setEditTeamStatus(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none bg-white focus:border-[#7c3aed] cursor-pointer"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {/* Selected Members Chips List matching the provided layout */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {editSelectedMembers.map((m, index) => (
                                    <span key={index} className="bg-gray-100 border border-gray-200 text-gray-800 text-xs px-3 py-1 rounded-md flex items-center gap-2">
                                        {m.name}
                                        <span
                                            onClick={() => setEditSelectedMembers(editSelectedMembers.filter(item => item.name !== m.name))}
                                            className="hover:text-red-500 cursor-pointer font-bold text-sm"
                                        >
                                            ×
                                        </span>
                                    </span>
                                ))}
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white sticky bottom-0">
                            <button
                                onClick={() => setEditingTeam(null)}
                                className={`px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer ${C.btnText}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateTeam}
                                className={`px-4 py-2 bg-[#7c3aed] text-white rounded-lg font-semibold hover:bg-[#6d28d9] cursor-pointer ${C.btnText}`}
                            >
                                Save Changes
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* Move Member Modal */}
            {moveModalData && (
                <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">

                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FolderInput size={18} className="text-gray-600" />
                                <h3 className={C.drawerTitle}>Move {moveModalData.member.name}</h3>
                            </div>
                            <button onClick={() => setMoveModalData(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="relative">
                                <label className="block text-gray-700 font-medium mb-1 text-xs">Select Team</label>

                                <div
                                    onClick={() => setIsMoveDropdownOpen(!isMoveDropdownOpen)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white flex items-center justify-between cursor-pointer text-xs"
                                >
                                    <span>
                                        {targetTeamId
                                            ? teams.find(t => t.id === targetTeamId)?.name
                                            : "Select Team"}
                                    </span>
                                    <ChevronDown size={14} className="text-gray-400" />
                                </div>

                                {isMoveDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                                        {teams.map(t => (
                                            <div
                                                key={t.id}
                                                onClick={() => {
                                                    setTargetTeamId(t.id)
                                                    setIsMoveDropdownOpen(false)
                                                }}
                                                className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-xs text-gray-800 border-b border-gray-50 last:border-none"
                                            >
                                                {t.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50/50">
                            <button onClick={() => setMoveModalData(null)} className={`px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer ${C.btnText}`}>
                                Cancel
                            </button>
                            <button onClick={handleMoveMemberConfirm} className={`px-4 py-2 bg-[#7c3aed] text-white rounded-lg font-semibold hover:bg-[#6d28d9] cursor-pointer ${C.btnText}`}>
                                Move
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* Create Team Slide-over Drawer */}
            {isCreateTeamOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 flex justify-end">
                    <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">

                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h2 className={C.drawerTitle}>Create Team</h2>
                            <button onClick={() => setIsCreateTeamOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>

                        <div className={`p-6 space-y-5 ${C.formText} flex-1`}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Team Name *</label>
                                    <input
                                        type="text"
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                        placeholder="E.g. Software Engineering Hiring Team"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#7c3aed]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Team Admin Name *</label>
                                    <input
                                        type="text"
                                        value={teamAdmin}
                                        onChange={(e) => setTeamAdmin(e.target.value)}
                                        placeholder="Start Typing Name or Email"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#7c3aed]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <label className="block text-gray-700 font-medium mb-1">Team Members</label>

                                    <div
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white flex items-center justify-between cursor-pointer min-h-[40px]"
                                    >
                                        <div className="flex flex-wrap gap-1.5 items-center">
                                            {selectedMembers.length === 0 ? (
                                                <span className="text-gray-400">Select Team Members</span>
                                            ) : (
                                                selectedMembers.map(m => (
                                                    <span key={m.id} className="bg-gray-100 text-gray-800 text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1">
                                                        {m.name}
                                                        <span onClick={(e) => { e.stopPropagation(); setSelectedMembers(selectedMembers.filter(item => item.id !== m.id)); }} className="hover:text-red-500 cursor-pointer font-bold">
                                                            ×
                                                        </span>
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                        <ChevronDown size={14} className="text-gray-400 shrink-0" />
                                    </div>

                                    {isDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            {usersLoading ? (
                                                <div className="px-3 py-2 text-xs text-gray-400">Loading invited users...</div>
                                            ) : availableUsers.length === 0 ? (
                                                <div className="px-3 py-2 text-xs text-gray-400">Abhi koi invited user available nahi hai.</div>
                                            ) : availableUsers.map(user => (
                                                <div
                                                    key={user.id}
                                                    onClick={() => {
                                                        if (!selectedMembers.some(m => m.id === user.id)) {
                                                            setSelectedMembers([...selectedMembers, user])
                                                        }
                                                        setIsDropdownOpen(false)
                                                    }}
                                                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex flex-col border-b border-gray-50 last:border-none"
                                                >
                                                    <span className="font-medium text-gray-800">{user.name}</span>
                                                    <span className="text-[10px] text-gray-400">{user.email}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Team Status</label>
                                    <select
                                        value={teamStatus}
                                        onChange={(e) => setTeamStatus(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none bg-white focus:border-[#7c3aed] cursor-pointer"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white sticky bottom-0">
                            <button onClick={() => setIsCreateTeamOpen(false)} className={`px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer ${C.btnText}`}>
                                Cancel
                            </button>
                            <button onClick={handleCreateTeam} className={`px-4 py-2 bg-[#7c3aed] text-white rounded-lg font-semibold hover:bg-[#6d28d9] cursor-pointer ${C.btnText}`}>
                                Create Team
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    )
}