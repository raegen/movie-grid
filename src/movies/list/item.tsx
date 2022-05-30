import StarBorderIcon from "@mui/icons-material/StarBorder";
import { IconButton, ImageListItem, ImageListItemBar } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { CSSProperties, FC, memo } from "react";
import { getPosterURL, Movie } from "../../hooks/useMovies";

export const Item: FC<Movie & { style: CSSProperties }> =
  memo(({ id, poster_path, title, release_date, isLoading, style }) =>
    isLoading ? (
      <ImageListItem
        style={{
          ...style,
          padding: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        key={id}
        cols={1}
        rows={1}
      >
        <CircularProgress />
      </ImageListItem>
    ) : (
      <ImageListItem
        style={{ ...style, padding: 1 }}
        key={id}
        cols={1}
        rows={1}
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
            >
              <StarBorderIcon />
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
    )
  );
