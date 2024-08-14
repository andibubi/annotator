package de.andreasbubolz.annotator.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Layout.
 */
@Entity
@Table(name = "layout")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Layout implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "created_at")
    private Instant created_at;

    @Column(name = "updated_at")
    private Instant updated_at;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "layout")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "layout", "gridElement", "gridElements" }, allowSetters = true)
    private Set<GridElement> gridElements = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Layout id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Layout name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getCreated_at() {
        return this.created_at;
    }

    public Layout created_at(Instant created_at) {
        this.setCreated_at(created_at);
        return this;
    }

    public void setCreated_at(Instant created_at) {
        this.created_at = created_at;
    }

    public Instant getUpdated_at() {
        return this.updated_at;
    }

    public Layout updated_at(Instant updated_at) {
        this.setUpdated_at(updated_at);
        return this;
    }

    public void setUpdated_at(Instant updated_at) {
        this.updated_at = updated_at;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Layout user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<GridElement> getGridElements() {
        return this.gridElements;
    }

    public void setGridElements(Set<GridElement> gridElements) {
        if (this.gridElements != null) {
            this.gridElements.forEach(i -> i.setLayout(null));
        }
        if (gridElements != null) {
            gridElements.forEach(i -> i.setLayout(this));
        }
        this.gridElements = gridElements;
    }

    public Layout gridElements(Set<GridElement> gridElements) {
        this.setGridElements(gridElements);
        return this;
    }

    public Layout addGridElements(GridElement gridElement) {
        this.gridElements.add(gridElement);
        gridElement.setLayout(this);
        return this;
    }

    public Layout removeGridElements(GridElement gridElement) {
        this.gridElements.remove(gridElement);
        gridElement.setLayout(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Layout)) {
            return false;
        }
        return getId() != null && getId().equals(((Layout) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Layout{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", created_at='" + getCreated_at() + "'" +
            ", updated_at='" + getUpdated_at() + "'" +
            "}";
    }
}
