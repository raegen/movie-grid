import StarBorderIcon from "@mui/icons-material/StarBorder";
import MovieIcon from "@mui/icons-material/Movie";
import StarIcon from "@mui/icons-material/Star";
import { IconButton, ImageListItem, ImageListItemBar } from "@mui/material";
import { CircularProgress } from "@mui/material";
import {
  CSSProperties,
  FC,
  KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { getPosterURL } from "../../hooks/useMovies";
import { Adjacent, Movie } from "../../types";
import { useIsFavorite, useSetFavorite } from "../../hooks/useFavorites";
import { useIsSelected, useSetSelected } from "../../hooks/useSelected";

export const Item: FC<{
  data: Movie;
  isLoading: boolean;
  style: CSSProperties;
  adjacent: Adjacent;
}> = memo(({ data, isLoading, style, adjacent }) => {
  const { data: isFavorite } = useIsFavorite(data?.id);
  const { mutateAsync: setFavorite } = useSetFavorite(data?.id);
  const isSelected = useIsSelected(data?.id);
  const { mutateAsync: setSelected } = useSetSelected();
  const toggleFavorite = useCallback(
    () => setFavorite(!isFavorite),
    [isFavorite, setFavorite]
  );
  const ref = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (isSelected) {
      ref.current?.focus();
    }
  }, [isSelected]);

  const keyHandlers: Record<string, () => void> = useMemo(
    () => ({
      ArrowUp: () => adjacent.up && setSelected(adjacent.up),
      ArrowRight: () => adjacent.right && setSelected(adjacent.right),
      ArrowDown: () => adjacent.down && setSelected(adjacent.down),
      ArrowLeft: () => adjacent.left && setSelected(adjacent.left),
      Enter: () => setFavorite(!isFavorite),
    }),
    [adjacent, isFavorite, setFavorite, setSelected]
  );

  const keyboardHandler = useCallback(
    (e: KeyboardEvent) => {
      keyHandlers[e.key]?.();
    },
    [keyHandlers]
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </div>
      );
    }

    const image = data.poster_path ? (
      <img
        src={getPosterURL(data.poster_path, 300)}
        alt={data.title}
        key="img"
        loading="lazy"
      />
    ) : (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "white",
        }}
      >
        <MovieIcon
          sx={{
            width: "100%",
            height: "100%",
            padding: "24px",
            color: "black",
          }}
        />
      </div>
    );

    const release_year = data.release_date
      ? new Date(data.release_date).getFullYear()
      : null;

    return [
      image,
      <ImageListItemBar
        sx={{
          background: `linear-gradient(to right, 
                  rgba(0,0,0,0) 0%, 
                  rgba(0,0,0,0) 75%,
                  rgba(0,0,0,0.3) 90%,
                  rgba(0,0,0,0.7) 100%)`,
        }}
        key="barTop"
        position="bottom"
        actionIcon={
          <IconButton
            sx={{ justifySelf: "flex-start", color: "white" }}
            aria-label={`star ${data.title}`}
            onClick={toggleFavorite}
            tabIndex={-1}
          >
            {isFavorite ? <StarIcon color="warning" /> : <StarBorderIcon />}
          </IconButton>
        }
        actionPosition="right"
      />,
      <ImageListItemBar
        sx={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
            "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
        }}
        key="barBottom"
        title={
          <div style={{ whiteSpace: "normal" }}>
            {data.title} {release_year ? `(${release_year})` : null}
          </div>
        }
        position="top"
      />,
    ];
  };

  return (
    <ImageListItem
      tabIndex={0}
      style={{
        ...style,
        outline: "none",
        padding: 1,
      }}
      sx={{
        ":focus": {
          borderWidth: 2,
          borderStyle: "solid",
          borderRadius: "5px",
          borderColor: "primary",
          zIndex: 99,
          boxShadow:
            "0px 7px 8px -4px rgb(0 0 0 / 80%), 0px 12px 17px 2px rgb(0 0 0 / 56%), 0px 5px 22px 4px rgb(0 0 0 / 48%)",
        },
      }}
      cols={1}
      rows={1}
      onClick={() => setSelected(data.id)}
      onKeyDown={keyboardHandler}
      component="li"
      ref={ref}
    >
      {renderContent()}
    </ImageListItem>
  );
});
