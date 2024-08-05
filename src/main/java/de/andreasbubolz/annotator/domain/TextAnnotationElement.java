package de.andreasbubolz.annotator.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TextAnnotationElement.
 */
@Entity
@Table(name = "text_annotation_element")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TextAnnotationElement implements Serializable {

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
    @Column(name = "text", nullable = false)
    private String text;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "textAnnotationElements", "user" }, allowSetters = true)
    private Annotation annotation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TextAnnotationElement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getStartSec() {
        return this.startSec;
    }

    public TextAnnotationElement startSec(Integer startSec) {
        this.setStartSec(startSec);
        return this;
    }

    public void setStartSec(Integer startSec) {
        this.startSec = startSec;
    }

    public String getText() {
        return this.text;
    }

    public TextAnnotationElement text(String text) {
        this.setText(text);
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Annotation getAnnotation() {
        return this.annotation;
    }

    public void setAnnotation(Annotation annotation) {
        this.annotation = annotation;
    }

    public TextAnnotationElement annotation(Annotation annotation) {
        this.setAnnotation(annotation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TextAnnotationElement)) {
            return false;
        }
        return getId() != null && getId().equals(((TextAnnotationElement) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TextAnnotationElement{" +
            "id=" + getId() +
            ", startSec=" + getStartSec() +
            ", text='" + getText() + "'" +
            "}";
    }
}
