import { useMemo, useState } from "react";
import {
  EmptyCell,
  RankHeader,
  ResetButton,
  StyledRankBoard,
  Table,
  TableCell,
  TableHead,
  TableHeader,
  Title,
} from "./RankBoard.styles";
import {
  clearRankings,
  compareRankings,
  formatSuccessTime,
  loadRankings,
} from "@/utils/rankingStorage";

const TABLE_HEADERS = ["순위", "레벨", "점수", "성공 시간"];

function RankBoard() {
  const [rankings, setRankings] = useState(loadRankings);

  const sortedRankings = useMemo(
    () => [...rankings].sort(compareRankings),
    [rankings],
  );

  const handleResetRanking = () => {
    const isConfirmed = window.confirm("랭킹 기록을 초기화할까요?");

    if (!isConfirmed) {
      return;
    }

    clearRankings();
    setRankings([]);
  };

  return (
    <StyledRankBoard>
      <RankHeader>
        <Title>랭킹 보드</Title>
        <ResetButton type="button" onClick={handleResetRanking}>
          기록 초기화
        </ResetButton>
      </RankHeader>

      <Table>
        <TableHead>
          <tr>
            {TABLE_HEADERS.map((header) => (
              <TableHeader key={header}>{header}</TableHeader>
            ))}
          </tr>
        </TableHead>
        <tbody>
          {sortedRankings.length > 0 ? (
            sortedRankings.map(({ level, score, successTime }, index) => (
              <tr key={`${successTime}-${level}-${score}-${index}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>Level {level}</TableCell>
                <TableCell>{score}점</TableCell>
                <TableCell>{formatSuccessTime(successTime)}</TableCell>
              </tr>
            ))
          ) : (
            <tr>
              <EmptyCell colSpan={4}>아직 기록이 없습니다.</EmptyCell>
            </tr>
          )}
        </tbody>
      </Table>
    </StyledRankBoard>
  );
}

export default RankBoard;
