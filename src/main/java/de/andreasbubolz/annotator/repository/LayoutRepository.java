package de.andreasbubolz.annotator.repository;

import de.andreasbubolz.annotator.domain.Layout;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Layout entity.
 */
@Repository
public interface LayoutRepository extends JpaRepository<Layout, Long>, JpaSpecificationExecutor<Layout> {
    @Query("select layout from Layout layout where layout.user.login = ?#{authentication.name}")
    List<Layout> findByUserIsCurrentUser();

    default Optional<Layout> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Layout> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Layout> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(value = "select layout from Layout layout left join fetch layout.user", countQuery = "select count(layout) from Layout layout")
    Page<Layout> findAllWithToOneRelationships(Pageable pageable);

    @Query("select layout from Layout layout left join fetch layout.user")
    List<Layout> findAllWithToOneRelationships();

    @Query("select layout from Layout layout left join fetch layout.user where layout.id =:id")
    Optional<Layout> findOneWithToOneRelationships(@Param("id") Long id);
}
