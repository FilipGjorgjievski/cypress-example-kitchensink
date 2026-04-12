Feature: ToDo Application

  Background:
    Given the user navigates to the ToDo application

  # CREATE
  Scenario: Add a single new task
    When the user types "Fix the flux capacitor" in the input field
    And the user presses Enter
    Then the task "Fix the flux capacitor" should appear in the list

  Scenario: Add multiple tasks
    When the user adds the following tasks:
      | task                        |
      | Fix the flux capacitor      |
      | Refuel the hovercraft       |
      | Debug the quantum compiler  |
    Then all 3 tasks should appear in the list

  Scenario Outline: Task input validation
    When the user types "<input>" in the input field
    And the user presses Enter
    Then "<expected_behavior>" should occur
    Examples:
      | input        | expected_behavior          |
      |              | no task is added           |
      |    spaces    | no task is added           |

  # READ / DISPLAY
  Scenario Outline: Display the correct task count
    When the user adds <count> tasks
    Then the counter should show "<expected_text>"
    Examples:
      | count | expected_text  |
      | 1     | 1 item left    |
      | 2     | 2 items left   |
      | 3     | 3 items left   |

  # UPDATE
  Scenario: Mark a task as completed
    Given the task "Fix the flux capacitor" exists in the list
    When the user clicks the checkbox next to "Fix the flux capacitor"
    Then the task "Fix the flux capacitor" should be marked as completed

  Scenario: Unmark a completed task
    Given the task "Fix the flux capacitor" is marked as completed
    When the user clicks the checkbox next to "Fix the flux capacitor"
    Then the task "Fix the flux capacitor" should be marked as active

  Scenario: Edit an existing task
    Given the task "Fix the flux capacitor" exists in the list
    When the user double-clicks on "Fix the flux capacitor"
    And clears the text and types "Replace the flux capacitor"
    And presses Enter
    Then the task "Replace the flux capacitor" should appear in the list

  Scenario: Mark all tasks as completed
    Given multiple tasks exist in the list
    When the user clicks the "Mark all as complete" toggle
    Then all tasks should be marked as completed

  # DELETE
  Scenario: Delete a single task
    Given the task "Fix the flux capacitor" exists in the list
    When the user hovers over "Fix the flux capacitor"
    And clicks the delete button
    Then the task "Fix the flux capacitor" should no longer appear in the list

  Scenario: Clear all completed tasks
    Given multiple completed tasks exist in the list
    When the user clicks "Clear completed"
    Then all completed tasks should be removed from the list

  # FILTERS
  Scenario: Filter by Active tasks
    Given the list contains active and completed tasks
    When the user clicks the "Active" filter
    Then only active tasks should be displayed

  Scenario: Filter by Completed tasks
    Given the list contains active and completed tasks
    When the user clicks the "Completed" filter
    Then only completed tasks should be displayed

  Scenario: Filter by All tasks
    Given the user is on the "Active" filter
    When the user clicks the "All" filter
    Then all tasks should be displayed
