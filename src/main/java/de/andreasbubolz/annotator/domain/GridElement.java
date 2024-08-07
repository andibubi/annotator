package de.andreasbubolz.annotator.domain;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class GridElement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer x;
    private Integer y;
    private Integer width;
    private Integer height;
    private String content;
    private Long displayAfterMillis; // Zeit, nach der das Element angezeigt wird
    private Long displayDurationMillis; // Dauer, für die das Element angezeigt wird

    @ManyToOne
    @JoinColumn(name = "layout_id")
    private Layout layout;

    @ManyToOne
    @JoinColumn(name = "parent_element_id")
    private GridElement parentElement;

    @OneToMany(mappedBy = "parentElement", cascade = CascadeType.ALL)
    private List<GridElement> childElements;

    // Getter und Setter
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

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
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

    public Layout getLayout() {
        return layout;
    }

    public void setLayout(Layout layout) {
        this.layout = layout;
    }

    public GridElement getParentElement() {
        return parentElement;
    }

    public void setParentElement(GridElement parentElement) {
        this.parentElement = parentElement;
    }

    public List<GridElement> getChildElements() {
        return childElements;
    }

    public void setChildElements(List<GridElement> childElements) {
        this.childElements = childElements;
    }
}
