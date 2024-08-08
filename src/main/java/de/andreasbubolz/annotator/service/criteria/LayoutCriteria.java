package de.andreasbubolz.annotator.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link de.andreasbubolz.annotator.domain.Layout} entity. This class is used
 * in {@link de.andreasbubolz.annotator.web.rest.LayoutResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /layouts?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LayoutCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter name;

    private InstantFilter created_at;

    private InstantFilter updated_at;

    private LongFilter userId;

    private LongFilter grtidWElementsId;

    private Boolean distinct;

    public LayoutCriteria() {}

    public LayoutCriteria(LayoutCriteria other) {
        this.id = other.optionalId().map(LongFilter::copy).orElse(null);
        this.name = other.optionalName().map(StringFilter::copy).orElse(null);
        this.created_at = other.optionalCreated_at().map(InstantFilter::copy).orElse(null);
        this.updated_at = other.optionalUpdated_at().map(InstantFilter::copy).orElse(null);
        this.userId = other.optionalUserId().map(LongFilter::copy).orElse(null);
        this.grtidWElementsId = other.optionalGrtidWElementsId().map(LongFilter::copy).orElse(null);
        this.distinct = other.distinct;
    }

    @Override
    public LayoutCriteria copy() {
        return new LayoutCriteria(this);
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

    public StringFilter getName() {
        return name;
    }

    public Optional<StringFilter> optionalName() {
        return Optional.ofNullable(name);
    }

    public StringFilter name() {
        if (name == null) {
            setName(new StringFilter());
        }
        return name;
    }

    public void setName(StringFilter name) {
        this.name = name;
    }

    public InstantFilter getCreated_at() {
        return created_at;
    }

    public Optional<InstantFilter> optionalCreated_at() {
        return Optional.ofNullable(created_at);
    }

    public InstantFilter created_at() {
        if (created_at == null) {
            setCreated_at(new InstantFilter());
        }
        return created_at;
    }

    public void setCreated_at(InstantFilter created_at) {
        this.created_at = created_at;
    }

    public InstantFilter getUpdated_at() {
        return updated_at;
    }

    public Optional<InstantFilter> optionalUpdated_at() {
        return Optional.ofNullable(updated_at);
    }

    public InstantFilter updated_at() {
        if (updated_at == null) {
            setUpdated_at(new InstantFilter());
        }
        return updated_at;
    }

    public void setUpdated_at(InstantFilter updated_at) {
        this.updated_at = updated_at;
    }

    public LongFilter getUserId() {
        return userId;
    }

    public Optional<LongFilter> optionalUserId() {
        return Optional.ofNullable(userId);
    }

    public LongFilter userId() {
        if (userId == null) {
            setUserId(new LongFilter());
        }
        return userId;
    }

    public void setUserId(LongFilter userId) {
        this.userId = userId;
    }

    public LongFilter getGrtidWElementsId() {
        return grtidWElementsId;
    }

    public Optional<LongFilter> optionalGrtidWElementsId() {
        return Optional.ofNullable(grtidWElementsId);
    }

    public LongFilter grtidWElementsId() {
        if (grtidWElementsId == null) {
            setGrtidWElementsId(new LongFilter());
        }
        return grtidWElementsId;
    }

    public void setGrtidWElementsId(LongFilter grtidWElementsId) {
        this.grtidWElementsId = grtidWElementsId;
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
        final LayoutCriteria that = (LayoutCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(name, that.name) &&
            Objects.equals(created_at, that.created_at) &&
            Objects.equals(updated_at, that.updated_at) &&
            Objects.equals(userId, that.userId) &&
            Objects.equals(grtidWElementsId, that.grtidWElementsId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, created_at, updated_at, userId, grtidWElementsId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LayoutCriteria{" +
            optionalId().map(f -> "id=" + f + ", ").orElse("") +
            optionalName().map(f -> "name=" + f + ", ").orElse("") +
            optionalCreated_at().map(f -> "created_at=" + f + ", ").orElse("") +
            optionalUpdated_at().map(f -> "updated_at=" + f + ", ").orElse("") +
            optionalUserId().map(f -> "userId=" + f + ", ").orElse("") +
            optionalGrtidWElementsId().map(f -> "grtidWElementsId=" + f + ", ").orElse("") +
            optionalDistinct().map(f -> "distinct=" + f + ", ").orElse("") +
        "}";
    }
}
