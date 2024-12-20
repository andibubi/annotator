package de.andreasbubolz.annotator.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link de.andreasbubolz.annotator.domain.GridElement} entity. This class is used
 * in {@link de.andreasbubolz.annotator.web.rest.GridElementResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /grid-elements?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GridElementCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private IntegerFilter x;

    private IntegerFilter y;

    private IntegerFilter w;

    private IntegerFilter h;

    private StringFilter channel;

    private StringFilter renderer;

    private StringFilter content;

    private BooleanFilter isCreateable;

    private LongFilter layoutId;

    private LongFilter gridElementId;

    private LongFilter gridElementsId;

    private Boolean distinct;

    public GridElementCriteria() {}

    public GridElementCriteria(GridElementCriteria other) {
        this.id = other.optionalId().map(LongFilter::copy).orElse(null);
        this.x = other.optionalX().map(IntegerFilter::copy).orElse(null);
        this.y = other.optionalY().map(IntegerFilter::copy).orElse(null);
        this.w = other.optionalW().map(IntegerFilter::copy).orElse(null);
        this.h = other.optionalH().map(IntegerFilter::copy).orElse(null);
        this.channel = other.optionalChannel().map(StringFilter::copy).orElse(null);
        this.renderer = other.optionalRenderer().map(StringFilter::copy).orElse(null);
        this.content = other.optionalContent().map(StringFilter::copy).orElse(null);
        this.layoutId = other.optionalLayoutId().map(LongFilter::copy).orElse(null);
        this.isCreateable = other.optionalIsCreateable().map(BooleanFilter::copy).orElse(null);
        this.gridElementId = other.optionalGridElementId().map(LongFilter::copy).orElse(null);
        this.gridElementsId = other.optionalGridElementsId().map(LongFilter::copy).orElse(null);
        this.distinct = other.distinct;
    }

    @Override
    public GridElementCriteria copy() {
        return new GridElementCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public Optional<LongFilter> optionalId() {
        return Optional.ofNullable(id);
    }

    public LongFilter id() {
        if (id == null) {
            setId(new LongFilter());
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public IntegerFilter getX() {
        return x;
    }

    public Optional<IntegerFilter> optionalX() {
        return Optional.ofNullable(x);
    }

    public IntegerFilter x() {
        if (x == null) {
            setX(new IntegerFilter());
        }
        return x;
    }

    public void setX(IntegerFilter x) {
        this.x = x;
    }

    public IntegerFilter getY() {
        return y;
    }

    public Optional<IntegerFilter> optionalY() {
        return Optional.ofNullable(y);
    }

    public IntegerFilter y() {
        if (y == null) {
            setY(new IntegerFilter());
        }
        return y;
    }

    public void setY(IntegerFilter y) {
        this.y = y;
    }

    public IntegerFilter getW() {
        return w;
    }

    public Optional<IntegerFilter> optionalW() {
        return Optional.ofNullable(w);
    }

    public IntegerFilter w() {
        if (w == null) {
            setW(new IntegerFilter());
        }
        return w;
    }

    public void setW(IntegerFilter w) {
        this.w = w;
    }

    public IntegerFilter getH() {
        return h;
    }

    public Optional<IntegerFilter> optionalH() {
        return Optional.ofNullable(h);
    }

    public IntegerFilter h() {
        if (h == null) {
            setH(new IntegerFilter());
        }
        return h;
    }

    public void setH(IntegerFilter h) {
        this.h = h;
    }

    public StringFilter getChannel() {
        return channel;
    }

    public Optional<StringFilter> optionalChannel() {
        return Optional.ofNullable(channel);
    }

    public StringFilter channel() {
        if (channel == null) {
            setChannel(new StringFilter());
        }
        return channel;
    }

    public void setChannel(StringFilter channel) {
        this.channel = channel;
    }

    public StringFilter getRenderer() {
        return renderer;
    }

    public Optional<StringFilter> optionalRenderer() {
        return Optional.ofNullable(renderer);
    }

    public StringFilter renderer() {
        if (renderer == null) {
            setRenderer(new StringFilter());
        }
        return renderer;
    }

    public void setRenderer(StringFilter renderer) {
        this.renderer = renderer;
    }

    public StringFilter getContent() {
        return content;
    }

    public Optional<StringFilter> optionalContent() {
        return Optional.ofNullable(content);
    }

    public StringFilter content() {
        if (content == null) {
            setContent(new StringFilter());
        }
        return content;
    }

    public void setContent(StringFilter content) {
        this.content = content;
    }

    public BooleanFilter getIsCreateable() {
        return isCreateable;
    }

    public Optional<BooleanFilter> optionalIsCreateable() {
        return Optional.ofNullable(isCreateable);
    }

    public BooleanFilter isCreateable() {
        if (isCreateable == null) {
            setIsCreateable(new BooleanFilter());
        }
        return isCreateable;
    }

    public void setIsCreateable(BooleanFilter isCreateable) {
        this.isCreateable = isCreateable;
    }

    public LongFilter getLayoutId() {
        return layoutId;
    }

    public Optional<LongFilter> optionalLayoutId() {
        return Optional.ofNullable(layoutId);
    }

    public LongFilter layoutId() {
        if (layoutId == null) {
            setLayoutId(new LongFilter());
        }
        return layoutId;
    }

    public void setLayoutId(LongFilter layoutId) {
        this.layoutId = layoutId;
    }

    public LongFilter getGridElementId() {
        return gridElementId;
    }

    public Optional<LongFilter> optionalGridElementId() {
        return Optional.ofNullable(gridElementId);
    }

    public LongFilter gridElementId() {
        if (gridElementId == null) {
            setGridElementId(new LongFilter());
        }
        return gridElementId;
    }

    public void setGridElementId(LongFilter gridElementId) {
        this.gridElementId = gridElementId;
    }

    public LongFilter getGridElementsId() {
        return gridElementsId;
    }

    public Optional<LongFilter> optionalGridElementsId() {
        return Optional.ofNullable(gridElementsId);
    }

    public LongFilter gridElementsId() {
        if (gridElementsId == null) {
            setGridElementsId(new LongFilter());
        }
        return gridElementsId;
    }

    public void setGridElementsId(LongFilter gridElementsId) {
        this.gridElementsId = gridElementsId;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public Optional<Boolean> optionalDistinct() {
        return Optional.ofNullable(distinct);
    }

    public Boolean distinct() {
        if (distinct == null) {
            setDistinct(true);
        }
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final GridElementCriteria that = (GridElementCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(x, that.x) &&
            Objects.equals(y, that.y) &&
            Objects.equals(w, that.w) &&
            Objects.equals(h, that.h) &&
            Objects.equals(channel, that.channel) &&
            Objects.equals(renderer, that.renderer) &&
            Objects.equals(content, that.content) &&
            Objects.equals(isCreateable, that.isCreateable) &&
            Objects.equals(layoutId, that.layoutId) &&
            Objects.equals(gridElementId, that.gridElementId) &&
            Objects.equals(gridElementsId, that.gridElementsId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, x, y, w, h, channel, renderer, content, isCreateable, layoutId, gridElementId, gridElementsId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GridElementCriteria{" +
            optionalId().map(f -> "id=" + f + ", ").orElse("") +
            optionalX().map(f -> "x=" + f + ", ").orElse("") +
            optionalY().map(f -> "y=" + f + ", ").orElse("") +
            optionalW().map(f -> "w=" + f + ", ").orElse("") +
            optionalH().map(f -> "h=" + f + ", ").orElse("") +
            optionalChannel().map(f -> "channel=" + f + ", ").orElse("") +
            optionalRenderer().map(f -> "renderer=" + f + ", ").orElse("") +
            optionalContent().map(f -> "content=" + f + ", ").orElse("") +
            optionalIsCreateable().map(f -> "isCreateable=" + f + ", ").orElse("") +
            optionalLayoutId().map(f -> "layoutId=" + f + ", ").orElse("") +
            optionalGridElementId().map(f -> "gridElementId=" + f + ", ").orElse("") +
            optionalGridElementsId().map(f -> "gridElementsId=" + f + ", ").orElse("") +
            optionalDistinct().map(f -> "distinct=" + f + ", ").orElse("") +
        "}";
    }
}
