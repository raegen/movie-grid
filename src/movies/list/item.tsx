import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { IconButton, ImageListItem, ImageListItemBar } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { CSSProperties, FC, memo } from "react";
import { getPosterURL } from "../../hooks/useMovies";
import { boxSelected } from "../../style";
import { Movie } from "../../types";

export const Item: FC<{
  data: Movie;
  isLoading: boolean;
  isSelected: boolean;
  isFavorite: boolean;
  onFavorite: () => void;
  onSelect: () => void;
  style: CSSProperties;
}> = memo(
  ({
    data,
    isLoading,
    isSelected,
    isFavorite,
    onFavorite,
    onSelect,
    style,
  }) => {
    if (isLoading) {
      return (
        <ImageListItem
          style={{
            ...style,
            ...(isSelected && boxSelected),
            padding: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          cols={1}
          rows={1}
        >
          <CircularProgress />
        </ImageListItem>
      );
    }

    const { poster_path, title, release_date } = data;
    return (
      <ImageListItem
        style={{ ...style, opacity: 0.9, ...(isSelected && boxSelected), padding: 1 }}
        cols={1}
        rows={1}
        onClick={onSelect}
      >
        <img src={getPosterURL(poster_path, 300)} alt={title} loading="lazy" />
        <ImageListItemBar
          sx={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
              "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
          }}
          position="top"
          actionIcon={
            <IconButton
              sx={{ justifySelf: "flex-start", color: "white" }}
              aria-label={`star ${title}`}
              onClick={onFavorite}
            >
              {isFavorite ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          }
          actionPosition="right"
        />
        <ImageListItemBar
          sx={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
              "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
          }}
          title={
            <div style={{ whiteSpace: "normal" }}>
              {title} ({new Date(release_date).getFullYear()})
            </div>
          }
          position="bottom"
        />
      </ImageListItem>
    );
  }
);
