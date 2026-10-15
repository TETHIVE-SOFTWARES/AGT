# Event photographs

Each event has its own folder. The folder name is the event slug.

```
public/img/events/ultratech-dealership/01.webp
public/img/events/ultratech-dealership/02.webp
```

## Add photos

1. Put image files in `public/img/events/<slug>/`. WebP, JPG and PNG are picked up. Name them so they sort in the order you want (`01.webp`, `02.webp`, …).
2. From the project root, run `npm run sync:events`.
3. That rewrites `data/event-images.generated.js`. The events list, the card slideshows, the detail-page photographs and the “Event photographs” widget all read that file.
4. Restart or refresh the dev server if the new images do not show.

`01.webp` is the first slide. One photo stays a still image. No photos in the folder shows the AGT placeholder.
