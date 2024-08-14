package de.andreasbubolz.annotator.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A GridElement.
 */
@Entity
@Table(name = "grid_element")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GridElement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "x")
    private Integer x;

    @Column(name = "y")
    private Integer y;

    @Column(name = "w")
    private Integer w;

    @Column(name = "h")
    private Integer h;

    @Column(name = "channel")
    private String channel;

    @Column(name = "renderer")
    private String renderer;

    @Column(name = "content")
    private String content;

    @Column(name = "display_after_millis")
    private Long displayAfterMillis;

    @Column(name = "display_duration_millis")
    private Long displayDurationMillis;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "user", "gridElements" }, allowSetters = true)
    private Layout layout;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "layout", "gridElement", "gridElements" }, allowSetters = true)
    private GridElement gridElement;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "gridElement")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "layout", "gridElement", "gridElements" }, allowSetters = true)
    private Set<GridElement> gridElements = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public GridElement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getX() {
        return this.x;
    }

    public GridElement x(Integer x) {
        this.setX(x);
        return this;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public Integer getY() {
        return this.y;
    }

    public GridElement y(Integer y) {
        this.setY(y);
        return this;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public Integer getW() {
        return this.w;
    }

    public GridElement w(Integer w) {
        this.setW(w);
        return this;
    }

    public void setW(Integer w) {
        this.w = w;
    }

    public Integer getH() {
        return this.h;
    }

    public GridElement h(Integer h) {
        this.setH(h);
        return this;
    }

    public void setH(Integer h) {
        this.h = h;
    }

    public String getChannel() {
        return this.channel;
    }

    public GridElement channel(String channel) {
        this.setChannel(channel);
        return this;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getRenderer() {
        return this.renderer;
    }

    public GridElement renderer(String renderer) {
        this.setRenderer(renderer);
        return this;
    }

    public void setRenderer(String renderer) {
        this.renderer = renderer;
    }

    public String getContent() {
        return this.content;
    }

    public GridElement content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getDisplayAfterMillis() {
        return this.displayAfterMillis;
    }

    public GridElement displayAfterMillis(Long displayAfterMillis) {
        this.setDisplayAfterMillis(displayAfterMillis);
        return this;
    }

    public void setDisplayAfterMillis(Long displayAfterMillis) {
        this.displayAfterMillis = displayAfterMillis;
    }

    public Long getDisplayDurationMillis() {
        return this.displayDurationMillis;
    }

    public GridElement displayDurationMillis(Long displayDurationMillis) {
        this.setDisplayDurationMillis(displayDurationMillis);
        return this;
    }

    public void setDisplayDurationMillis(Long displayDurationMillis) {
        this.displayDurationMillis = displayDurationMillis;
    }

    public Layout getLayout() {
        return this.layout;
    }

    public void setLayout(Layout layout) {
        this.layout = layout;
    }

    public GridElement layout(Layout layout) {
        this.setLayout(layout);
        return this;
    }

    public GridElement getGridElement() {
        return this.gridElement;
    }

    public void setGridElement(GridElement gridElement) {
        this.gridElement = gridElement;
    }

    public GridElement gridElement(GridElement gridElement) {
        this.setGridElement(gridElement);
        return this;
    }

    public Set<GridElement> getGridElements() {
        return this.gridElements;
    }

    public void setGridElements(Set<GridElement> gridElements) {
        if (this.gridElements != null) {
            this.gridElements.forEach(i -> i.setGridElement(null));
        }
        if (gridElements != null) {
            gridElements.forEach(i -> i.setGridElement(this));
        }
        this.gridElements = gridElements;
    }

    public GridElement gridElements(Set<GridElement> gridElements) {
        this.setGridElements(gridElements);
        return this;
    }

    public GridElement addGridElements(GridElement gridElement) {
        this.gridElements.add(gridElement);
        gridElement.setGridElement(this);
        return this;
    }

    public GridElement removeGridElements(GridElement gridElement) {
        this.gridElements.remove(gridElement);
        gridElement.setGridElement(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GridElement)) {
            return false;
        }
        return getId() != null && getId().equals(((GridElement) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GridElement{" +
            "id=" + getId() +
            ", x=" + getX() +
            ", y=" + getY() +
            ", w=" + getW() +
            ", h=" + getH() +
            ", channel='" + getChannel() + "'" +
            ", renderer='" + getRenderer() + "'" +
            ", content='" + getContent() + "'" +
            ", displayAfterMillis=" + getDisplayAfterMillis() +
            ", displayDurationMillis=" + getDisplayDurationMillis() +
            "}";
    }
}
