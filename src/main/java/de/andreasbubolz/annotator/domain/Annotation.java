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
    private Set<TextAnnotationElement> textAnnotationElements = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "annotation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "annotation" }, allowSetters = true)
    private Set<VideoAnnotationElement> videoAnnotationElements = new HashSet<>();

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

    public Set<TextAnnotationElement> getTextAnnotationElements() {
        return this.textAnnotationElements;
    }

    public void setTextAnnotationElements(Set<TextAnnotationElement> textAnnotationElements) {
        if (this.textAnnotationElements != null) {
            this.textAnnotationElements.forEach(i -> i.setAnnotation(null));
        }
        if (textAnnotationElements != null) {
            textAnnotationElements.forEach(i -> i.setAnnotation(this));
        }
        this.textAnnotationElements = textAnnotationElements;
    }

    public Annotation textAnnotationElements(Set<TextAnnotationElement> textAnnotationElements) {
        this.setTextAnnotationElements(textAnnotationElements);
        return this;
    }

    public Annotation addTextAnnotationElement(TextAnnotationElement textAnnotationElement) {
        this.textAnnotationElements.add(textAnnotationElement);
        textAnnotationElement.setAnnotation(this);
        return this;
    }

    public Annotation removeTextAnnotationElement(TextAnnotationElement textAnnotationElement) {
        this.textAnnotationElements.remove(textAnnotationElement);
        textAnnotationElement.setAnnotation(null);
        return this;
    }

    public Set<VideoAnnotationElement> getVideoAnnotationElements() {
        return this.videoAnnotationElements;
    }

    public void setVideoAnnotationElements(Set<VideoAnnotationElement> videoAnnotationElements) {
        if (this.videoAnnotationElements != null) {
            this.videoAnnotationElements.forEach(i -> i.setAnnotation(null));
        }
        if (videoAnnotationElements != null) {
            videoAnnotationElements.forEach(i -> i.setAnnotation(this));
        }
        this.videoAnnotationElements = videoAnnotationElements;
    }

    public Annotation videoAnnotationElements(Set<VideoAnnotationElement> videoAnnotationElements) {
        this.setVideoAnnotationElements(videoAnnotationElements);
        return this;
    }

    public Annotation addVideoAnnotationElement(VideoAnnotationElement videoAnnotationElement) {
        this.videoAnnotationElements.add(videoAnnotationElement);
        videoAnnotationElement.setAnnotation(this);
        return this;
    }

    public Annotation removeVideoAnnotationElement(VideoAnnotationElement videoAnnotationElement) {
        this.videoAnnotationElements.remove(videoAnnotationElement);
        videoAnnotationElement.setAnnotation(null);
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
