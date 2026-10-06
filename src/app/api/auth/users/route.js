import { NextResponse } from 'next/server';
import User from '../../../../../models/user';
import { connectDB } from '../../../../../lib/db';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    await connectDB();

    // 1. Current logged-in user ki ID nikalen
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const loggedInUserId = decoded.userId;

    // 2. Sirf unhi users ko dhundhein jo is logged-in user ne invite kiye hain
    const usersFromDb = await User.find({ invitedBy: loggedInUserId });

    const formattedUsers = usersFromDb.map((user) => {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User';
      const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';

      const formattedDate = user.createdAt 
        ? new Date(user.createdAt).toLocaleDateString('en-GB') 
        : '01/05/2025';

      return {
        id: user._id,
        name: fullName,
        email: user.email,
        initials: initials,
        role: user.systemRoles || 'Standard User',
        status: user.status || 'Active',
        job: user.jobTitle || 'N/A',
        team: user.team || 'Default',
        timeAgo: 'Recently',
        date: formattedDate
      };
    });

    return NextResponse.json({ success: true, users: formattedUsers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}