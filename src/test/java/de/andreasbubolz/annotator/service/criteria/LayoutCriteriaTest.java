package de.andreasbubolz.annotator.service.criteria;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.function.BiFunction;
import java.util.function.Function;
import org.assertj.core.api.Condition;
import org.junit.jupiter.api.Test;

class LayoutCriteriaTest {

    @Test
    void newLayoutCriteriaHasAllFiltersNullTest() {
        var layoutCriteria = new LayoutCriteria();
        assertThat(layoutCriteria).is(criteriaFiltersAre(filter -> filter == null));
    }

    @Test
    void layoutCriteriaFluentMethodsCreatesFiltersTest() {
        var layoutCriteria = new LayoutCriteria();

        setAllFilters(layoutCriteria);

        assertThat(layoutCriteria).is(criteriaFiltersAre(filter -> filter != null));
    }

    @Test
    void layoutCriteriaCopyCreatesNullFilterTest() {
        var layoutCriteria = new LayoutCriteria();
        var copy = layoutCriteria.copy();

        assertThat(layoutCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(filter -> filter == null)),
            criteria -> assertThat(criteria).isEqualTo(layoutCriteria)
        );
    }

    @Test
    void layoutCriteriaCopyDuplicatesEveryExistingFilterTest() {
        var layoutCriteria = new LayoutCriteria();
        setAllFilters(layoutCriteria);

        var copy = layoutCriteria.copy();

        assertThat(layoutCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(filter -> filter != null)),
            criteria -> assertThat(criteria).isEqualTo(layoutCriteria)
        );
    }

    @Test
    void toStringVerifier() {
        var layoutCriteria = new LayoutCriteria();

        assertThat(layoutCriteria).hasToString("LayoutCriteria{}");
    }

    private static void setAllFilters(LayoutCriteria layoutCriteria) {
        layoutCriteria.id();
        layoutCriteria.name();
        layoutCriteria.created_at();
        layoutCriteria.updated_at();
        layoutCriteria.userId();
        layoutCriteria.distinct();
    }

    private static Condition<LayoutCriteria> criteriaFiltersAre(Function<Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId()) &&
                condition.apply(criteria.getName()) &&
                condition.apply(criteria.getCreated_at()) &&
                condition.apply(criteria.getUpdated_at()) &&
                condition.apply(criteria.getUserId()) &&
                condition.apply(criteria.getDistinct()),
            "every filter matches"
        );
    }

    private static Condition<LayoutCriteria> copyFiltersAre(LayoutCriteria copy, BiFunction<Object, Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId(), copy.getId()) &&
                condition.apply(criteria.getName(), copy.getName()) &&
                condition.apply(criteria.getCreated_at(), copy.getCreated_at()) &&
                condition.apply(criteria.getUpdated_at(), copy.getUpdated_at()) &&
                condition.apply(criteria.getUserId(), copy.getUserId()) &&
                condition.apply(criteria.getDistinct(), copy.getDistinct()),
            "every filter matches"
        );
    }
}
