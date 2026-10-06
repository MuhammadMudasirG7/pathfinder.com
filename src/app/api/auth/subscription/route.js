import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Subscription from '../../../../../models/Subscription';
import User from '../../../../../models/user';
import { connectDB } from '../../../../../lib/db';

export async function GET(request) {
    try {
        await connectDB();

        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, error: 'Unauthorized access!' }, { status: 401 });
        }

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedUser.id || decodedUser.userId;

        // User collection se data fetch karna
        let dbUser = await User.findById(userId);
        
        // firstName aur lastName ko mila kar full name banana
        let fullName = '';
        if (dbUser?.firstName || dbUser?.lastName) {
            fullName = `${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim();
        }

        const userName = decodedUser.name || 
                         fullName || 
                         dbUser?.name || 
                         dbUser?.fullName || 
                         dbUser?.userName || 
                         (dbUser?.email ? dbUser.email.split('@')[0] : 'User');

        const userEmail = decodedUser.email || dbUser?.email || '';

        let subscription = await Subscription.findOne({ userId: userId });

        if (!subscription) {
            subscription = await Subscription.create({
                userId: userId,
                accountId: `PFAC${Math.floor(1000 + Math.random() * 9000)}`,
                currentPlan: 'Starter',
                ownerName: userName,
                ownerEmail: userEmail,
                activeUsersCount: 1, 
                activationDate: new Date()
            });
        } else {
            let needsUpdate = false;
            if (!subscription.accountId) {
                subscription.accountId = `PFAC${Math.floor(1000 + Math.random() * 9000)}`;
                needsUpdate = true;
            }
            // Agar purana naam "User" hai ya match nahi ho raha toh update kar dein
            if (!subscription.ownerName || subscription.ownerName === 'User' || subscription.ownerName !== userName) {
                subscription.ownerName = userName;
                needsUpdate = true;
            }
            if (!subscription.ownerEmail && userEmail) {
                subscription.ownerEmail = userEmail;
                needsUpdate = true;
            }
            if (!subscription.activationDate) {
                subscription.activationDate = new Date();
                needsUpdate = true;
            }
            if (!subscription.activeUsersCount) {
                subscription.activeUsersCount = 1;
                needsUpdate = true;
            }
            if (needsUpdate) {
                await subscription.save();
            }
        }

        const starterUsersCount = await Subscription.countDocuments({ currentPlan: 'Starter' });
        const growthUsersCount = await Subscription.countDocuments({ currentPlan: 'Growth' });
        const professionalUsersCount = await Subscription.countDocuments({ currentPlan: 'Professional' });

        return NextResponse.json({
            success: true,
            data: subscription,
            planCounts: {
                Starter: starterUsersCount,
                Growth: growthUsersCount,
                Professional: professionalUsersCount
            }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        await connectDB();

        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, error: 'Unauthorized access!' }, { status: 401 });
        }

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedUser.id || decodedUser.userId;

        let dbUser = await User.findById(userId);
        let fullName = '';
        if (dbUser?.firstName || dbUser?.lastName) {
            fullName = `${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim();
        }

        const userName = decodedUser.name || fullName || dbUser?.name || dbUser?.fullName || 'User';
        const userEmail = decodedUser.email || dbUser?.email || '';

        const body = await request.json();
        const { action, currentPlan, newOwnerName, newOwnerEmail } = body;

        let updateData = {};

        if (action === 'updatePlan') {
            const allowedPlans = ['Starter', 'Growth', 'Professional'];
            if (!allowedPlans.includes(currentPlan)) {
                return NextResponse.json({ success: false, error: 'Invalid plan selected!' }, { status: 400 });
            }
            updateData.currentPlan = currentPlan;
        }

        if (action === 'transferOwnership') {
            if (!newOwnerName || !newOwnerEmail) {
                return NextResponse.json({ success: false, error: 'Owner name and email are required!' }, { status: 400 });
            }
            updateData.ownerName = newOwnerName;
            updateData.ownerEmail = newOwnerEmail;
        }

        const updatedSubscription = await Subscription.findOneAndUpdate(
            { userId: userId },
            { 
                $set: updateData,$setOnInsert: {
                    accountId: `PFAC${Math.floor(1000 + Math.random() * 9000)}`,
                    activeUsersCount: 1,
                    activationDate: new Date()
                }
            },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, data: updatedSubscription }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}