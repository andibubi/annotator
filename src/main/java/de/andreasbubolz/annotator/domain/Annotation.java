package de.andreasbubolz.annotator.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Annotation.
 */
@Entity
@Table(name = "annotation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Annotation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "video_id", nullable = false)
    private String videoId;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "annotation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "annotation" }, allowSetters = true)
    private Set<AnnotationElement> annotationElements = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Annotation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVideoId() {
        return this.videoId;
    }

    public Annotation videoId(String videoId) {
        this.setVideoId(videoId);
        return this;
    }

    public void setVideoId(String videoId) {
        this.videoId = videoId;
    }

    public Set<AnnotationElement> getAnnotationElements() {
        return this.annotationElements;
    }

    public void setAnnotationElements(Set<AnnotationElement> annotationElements) {
        if (this.annotationElements != null) {
            this.annotationElements.forEach(i -> i.setAnnotation(null));
        }
        if (annotationElements != null) {
            annotationElements.forEach(i -> i.setAnnotation(this));
        }
        this.annotationElements = annotationElements;
    }

    public Annotation annotationElements(Set<AnnotationElement> annotationElements) {
        this.setAnnotationElements(annotationElements);
        return this;
    }

    public Annotation addAnnotationElement(AnnotationElement annotationElement) {
        this.annotationElements.add(annotationElement);
        annotationElement.setAnnotation(this);
        return this;
    }

    public Annotation removeAnnotationElement(AnnotationElement annotationElement) {
        this.annotationElements.remove(annotationElement);
        annotationElement.setAnnotation(null);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Annotation user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Annotation)) {
            return false;
        }
        return getId() != null && getId().equals(((Annotation) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Annotation{" +
            "id=" + getId() +
            ", videoId='" + getVideoId() + "'" +
            "}";
    }
}
