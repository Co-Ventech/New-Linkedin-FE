import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, isCompanyUser } from '../slices/userSlice';
import Header from '../components/Header';
import {
} from '../slices/jobsSlice';
import { updateJobStatusGeneric, addJobCommentGeneric, addJobProposalGeneric } from '../api/jobService';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userState = useSelector((s)=> s.jobs.userView);
  const sentinelRef = useRef(null);

  const [commentDraft, setCommentDraft] = useState({});
  const [proposalDraft, setProposalDraft] = useState({});
  const [profile, setProfile] = useState({ username: user?.username || '', email: user?.email || '' });

  useEffect(() => {
    if (!user?.id) return;
    dispatch(fetchUserJobsThunk({ userId: user.id, page: 1, limit: 20 }));
    dispatch(fetchUserAnalyticsThunk({ userId: user.id }));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const io = new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if (entry.isIntersecting && userState.jobsHasMore && !userState.jobsLoading) {
          dispatch(fetchUserJobsThunk({ userId: user.id, page: userState.jobsPage + 1, limit: 20 }));
        }
      });
    });
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [userState.jobsHasMore, userState.jobsLoading, userState.jobsPage, dispatch, user?.id]);

  if (!isCompanyUser(user)) {
    return <div className="p-6 text-red-600">Access denied. Company user only.</div>;
  }

  const updateStatus = async (jobId, status) => {
    await updateJobStatusGeneric(jobId, status);
    // simple refresh first page
    dispatch(fetchUserJobsThunk({ userId: user.id, page: 1, limit: 20 }));
  };

  const addComment = async (jobId) => {
    const text = commentDraft[jobId];
    if (!text) return;
    await addJobCommentGeneric(jobId, { comment: text });
    setCommentDraft({ ...commentDraft, [jobId]: '' });
  };

  const addProposal = async (jobId) => {
    const text = proposalDraft[jobId];
    if (!text) return;
    await addJobProposalGeneric(jobId, { proposal: text });
    setProposalDraft({ ...proposalDraft, [jobId]: '' });
  };

  const saveProfile = () => {
    dispatch(updateUserProfileThunk({ userId: user.id, payload: profile }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header hideDownloadExcel />
      <main className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Analytics */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">My Analytics</h2>
          {userState.analytics.loading ? (
            <div>Loading...</div>
          ) : userState.analytics.data ? (
            <div className="grid md:grid-cols-3 gap-3">
              <div className="border rounded p-3">
                <div className="text-sm text-gray-500">Assigned</div>
                <div className="text-2xl font-semibold">{userState.analytics.data.assigned ?? '-'}</div>
              </div>
              <div className="border rounded p-3">
                <div className="text-sm text-gray-500">In Progress</div>
                <div className="text-2xl font-semibold">{userState.analytics.data.inProgress ?? '-'}</div>
              </div>
              <div className="border rounded p-3">
                <div className="text-sm text-gray-500">Closed</div>
                <div className="text-2xl font-semibold">{userState.analytics.data.closed ?? '-'}</div>
              </div>
            </div>
          ) : (
            <div>No analytics.</div>
          )}
        </section>

        {/* Profile */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <input className="border p-2 rounded" placeholder="Username" value={profile.username} onChange={(e)=>setProfile({...profile, username:e.target.value})} />
            <input className="border p-2 rounded" placeholder="Email" value={profile.email} onChange={(e)=>setProfile({...profile, email:e.target.value})} />
            <button className="bg-blue-600 text-white rounded px-4 py-2" onClick={saveProfile} disabled={userState.updatingProfile}>Save</button>
          </div>
        </section>

        {/* Assigned Jobs */}
        <section className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">My Jobs</h2>
          <div className="space-y-3">
            {(userState.jobs||[]).map(j => (
              <div key={j.id} className="border rounded p-3">
                <div className="font-medium">{j.title}</div>
                <div className="text-sm text-gray-600">{typeof j.company === 'object' ? j.company?.name : j.company}</div>
                <div className="flex gap-2 mt-2">
                  <select className="border p-1 rounded" value={j.status || j.currentStatus || ''} onChange={(e)=>updateStatus(j.id, e.target.value)}>
                    <option value="">Select status</option>
                    <option value="applied">Applied</option>
                    <option value="in_progress">In Progress</option>
                    <option value="interview">Interview</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="mt-2 flex gap-2">
                  <input className="border p-2 rounded flex-1" placeholder="Add comment" value={commentDraft[j.id]||''} onChange={(e)=>setCommentDraft({...commentDraft, [j.id]: e.target.value})} />
                  <button className="px-3 py-2 border rounded" onClick={()=>addComment(j.id)}>Add</button>
                </div>
                <div className="mt-2 flex gap-2">
                  <textarea className="border p-2 rounded flex-1" placeholder="Proposal" value={proposalDraft[j.id]||''} onChange={(e)=>setProposalDraft({...proposalDraft, [j.id]: e.target.value})} />
                  <button className="px-3 py-2 border rounded" onClick={()=>addProposal(j.id)}>Save Proposal</button>
                </div>
              </div>
            ))}
            <div ref={sentinelRef} style={{ height: 1 }} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;