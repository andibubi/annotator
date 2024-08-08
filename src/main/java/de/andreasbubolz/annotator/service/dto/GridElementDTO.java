package de.andreasbubolz.annotator.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link de.andreasbubolz.annotator.domain.GridElement} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GridElementDTO implements Serializable {

    private Long id;

    private Integer x;

    private Integer y;

    private Integer w;

    private Integer h;

    private String content;

    private Long displayAfterMillis;

    private Long displayDurationMillis;

    private LayoutDTO layout;

    private GridElementDTO gridElement;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public Integer getY() {
        return y;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public Integer getW() {
        return w;
    }

    public void setW(Integer w) {
        this.w = w;
    }

    public Integer getH() {
        return h;
    }

    public void setH(Integer h) {
        this.h = h;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getDisplayAfterMillis() {
        return displayAfterMillis;
    }

    public void setDisplayAfterMillis(Long displayAfterMillis) {
        this.displayAfterMillis = displayAfterMillis;
    }

    public Long getDisplayDurationMillis() {
        return displayDurationMillis;
    }

    public void setDisplayDurationMillis(Long displayDurationMillis) {
        this.displayDurationMillis = displayDurationMillis;
    }

    public LayoutDTO getLayout() {
        return layout;
    }

    public void setLayout(LayoutDTO layout) {
        this.layout = layout;
    }

    public GridElementDTO getGridElement() {
        return gridElement;
    }

    public void setGridElement(GridElementDTO gridElement) {
        this.gridElement = gridElement;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GridElementDTO)) {
            return false;
        }

        GridElementDTO gridElementDTO = (GridElementDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, gridElementDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GridElementDTO{" +
            "id=" + getId() +
            ", x=" + getX() +
            ", y=" + getY() +
            ", w=" + getW() +
            ", h=" + getH() +
            ", content='" + getContent() + "'" +
            ", displayAfterMillis=" + getDisplayAfterMillis() +
            ", displayDurationMillis=" + getDisplayDurationMillis() +
            ", layout=" + getLayout() +
            ", gridElement=" + getGridElement() +
            "}";
    }
}
