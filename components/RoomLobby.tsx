import { Room, User } from "@prisma/client";

import { QuestionWithCommentsAndPastcasts } from "../types/additional";

export const RoomLobby = ({
  room,
}: {
  room: Room & {
    members: User[];
    questions: QuestionWithCommentsAndPastcasts[];
  };
}) => {
  return (
    <div>
      <h1>Room Lobby</h1>
    </div>
  );
};
