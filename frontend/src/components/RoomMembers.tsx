import { Room } from "../api/taskApi";

interface Props {
  room: Room;
  currentUserId: number;
  onRemoveMember: (userId: number) => Promise<void>;
}

export default function RoomMembers({
  room,
  currentUserId,
  onRemoveMember,
}: Props) {
  const isOwner = room.ownerId === currentUserId;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Üyeler</h3>
          <p className="mt-1 text-xs text-slate-400">
            {room.members.length} üye
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {room.members.map((member) => {
          const memberIsOwner = member.user.id === room.ownerId;

          return (
            <div
              key={member.user.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5"
            >
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {member.user.name}
                </p>

                {memberIsOwner && (
                  <p className="text-[11px] text-brand-600">
                    Oda sahibi
                  </p>
                )}
              </div>

              {isOwner && !memberIsOwner && (
                <button
                  type="button"
                  onClick={() => onRemoveMember(member.user.id)}
                  className="rounded-md px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                >
                  Üyeyi çıkar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
