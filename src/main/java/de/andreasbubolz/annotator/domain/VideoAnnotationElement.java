package de.andreasbubolz.annotator.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TextAnnotationElement.
 */
@Entity
@Table(name = "video_annotation_element")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class VideoAnnotationElement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "start_sec", nullable = false)
    private Integer startSec;

    @NotNull
    @Column(name = "stop_sec", nullable = false)
    private Integer stopSec;

    @NotNull
    @Column(name = "video_id", nullable = false)
    private String videoId;

    @NotNull
    @Column(name = "video_start_sec", nullable = false)
    private Integer videoStartSec;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "videoAnnotationElements", "user" }, allowSetters = true)
    private Annotation annotation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public VideoAnnotationElement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getStartSec() {
        return this.startSec;
    }

    public Integer getVideoStartSec() {
        return this.videoStartSec;
    }

    public Integer getStopSec() {
        return this.stopSec;
    }

    public VideoAnnotationElement startSec(Integer startSec) {
        this.setStartSec(startSec);
        return this;
    }

    public VideoAnnotationElement videoStartSec(Integer videoStartSec) {
        this.setVideoStartSec(videoStartSec);
        return this;
    }

    public VideoAnnotationElement stopSec(Integer stopSec) {
        this.setStopSec(stopSec);
        return this;
    }

    public void setStartSec(Integer startSec) {
        this.startSec = startSec;
    }

    public void setVideoStartSec(Integer videoStartSec) {
        this.videoStartSec = videoStartSec;
    }

    public void setStopSec(Integer stopSec) {
        this.stopSec = stopSec;
    }

    public String getVideoId() {
        return this.videoId;
    }

    public VideoAnnotationElement videoId(String videoId) {
        this.setVideoId(videoId);
        return this;
    }

    public void setVideoId(String videoId) {
        this.videoId = videoId;
    }

    public Annotation getAnnotation() {
        return this.annotation;
    }

    public void setAnnotation(Annotation annotation) {
        this.annotation = annotation;
    }

    public VideoAnnotationElement annotation(Annotation annotation) {
        this.setAnnotation(annotation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VideoAnnotationElement)) {
            return false;
        }
        return getId() != null && getId().equals(((VideoAnnotationElement) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VideoAnnotationElement{" +
            "id=" + getId() +
            ", startSec=" + getStartSec() +
            ", stopSec=" + getStopSec() +
            ", videoId='" + getVideoId() + "'" +
            ", videoStartSec=" + getVideoStartSec() +
            "}";
    }
}
